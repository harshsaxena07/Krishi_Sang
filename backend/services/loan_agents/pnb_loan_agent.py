import requests
from bs4 import BeautifulSoup
from db import get_db_connection
from services.ai_validator import validate_loan


def fetch_pnb_loans():
    loans = []

    try:
        url = "https://www.pnbindia.in/agriculture-banking.html"

        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            headings = soup.find_all(["h2", "h3"])

            for h in headings:
                name = h.get_text(strip=True)

                # -------------------------
                # 🔥 BASIC CLEANING
                # -------------------------

                if len(name) < 5 or len(name) > 100:
                    continue

                name_lower = name.lower()

                # Remove UI junk
                junk_words = [
                    "apply", "watch", "video", "faq",
                    "explore", "online", "click", "more"
                ]

                if any(j in name_lower for j in junk_words):
                    continue

                # 🔥 IMPORTANT: Only pass possible loan-related text
                if not any(word in name_lower for word in ["loan", "credit", "kisan", "agri"]):
                    continue

                loans.append({
                    "name": f"PNB {name}",
                    "name_hi": f"PNB {name}",
                    "bank": "PNB",
                    "purpose": "Agriculture and farmer loan support",
                    "purpose_hi": "कृषि और किसान ऋण सहायता",
                    "eligibility": "Farmers with valid land and KYC documents",
                    "eligibility_hi": "वैध भूमि और केवाईसी दस्तावेज़ वाले किसान",
                    "documents": ["Aadhaar", "Land Proof", "Bank Statement"],
                    "documents_hi": ["आधार", "भूमि प्रमाण", "बैंक स्टेटमेंट"],
                    "official_website": url,
                    "image": "/images/pnb.png"
                })

        else:
            print("PNB request failed:", response.status_code)

    except Exception as e:
        print("PNB scraping failed:", e)

    # -------------------------
    # 🔥 FALLBACK DATA
    # -------------------------
    if len(loans) == 0:
        print("Using fallback PNB data")

        loans.append({
            "name": "PNB Kisan Credit Card Loan",
            "name_hi": "पीएनबी किसान क्रेडिट कार्ड ऋण",
            "bank": "PNB",
            "purpose": "Crop loan support",
            "purpose_hi": "फसल ऋण सहायता",
            "eligibility": "Farmers with land",
            "eligibility_hi": "भूमि वाले किसान",
            "documents": ["Aadhaar", "Land Proof"],
            "documents_hi": ["आधार", "भूमि प्रमाण"],
            "official_website": url,
            "image": "/images/pnb.png"
        })

    print("Fetched PNB loans:", len(loans))
    return loans


# ---------------------------
# DATABASE FUNCTIONS
# ---------------------------

def loan_exists(name):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id FROM loans WHERE LOWER(name) = LOWER(%s);",
        (name,)
    )

    result = cur.fetchone()

    cur.close()
    conn.close()

    return result is not None


def request_exists(name):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id FROM loan_requests WHERE LOWER(name) = LOWER(%s);",
        (name,)
    )

    result = cur.fetchone()

    cur.close()
    conn.close()

    return result is not None


def insert_loan_request(loan):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO loan_requests 
        (name, name_hi, bank, purpose, purpose_hi, eligibility, eligibility_hi, documents, documents_hi, official_website, image)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        loan["name"],
        loan["name_hi"],
        loan["bank"],
        loan["purpose"],
        loan["purpose_hi"],
        loan["eligibility"],
        loan["eligibility_hi"],
        list(loan["documents"]),
        list(loan["documents_hi"]),
        loan["official_website"],
        loan["image"]
    ))

    conn.commit()
    cur.close()
    conn.close()


# ---------------------------
# MAIN AGENT
# ---------------------------

def run_pnb_agent():
    loans = fetch_pnb_loans()
    inserted_count = 0

    for loan in loans:

        print("VALIDATING:", loan["name"])  # DEBUG

        if not validate_loan(loan["name"]):
            print("Rejected by AI:", loan["name"])
            continue

        if loan_exists(loan["name"]):
            print("Already in main table:", loan["name"])
            continue

        if request_exists(loan["name"]):
            print("Already in request table:", loan["name"])
            continue

        insert_loan_request(loan)
        inserted_count += 1
        print("Request Added:", loan["name"])

    print("PNB request inserted count:", inserted_count)
    return inserted_count