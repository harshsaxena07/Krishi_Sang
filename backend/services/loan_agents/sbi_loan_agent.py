import requests
from bs4 import BeautifulSoup
from db import get_db_connection
from services.ai_validator import validate_loan


def fetch_sbi_loans():
    loans = []

    try:
        sbi_url = "https://sbi.co.in/web/agri-rural/agriculture-banking"

        headers = {
            "User-Agent": "Mozilla/5.0"
        }

        response = requests.get(sbi_url, headers=headers, timeout=10)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            # 🔥 STEP 1: Focus on main content only
            main_content = soup.find("div", {"id": "content"}) or soup

            headings = main_content.find_all(["h2", "h3", "a"])

            for h in headings:
                name = h.get_text(strip=True)

                if not name:
                    continue

                name_lower = name.lower()

                # -------------------------
                # 🔥 STRICT REAL FILTER
                # -------------------------

                # Must contain agriculture context
                if not any(word in name_lower for word in ["agriculture", "crop", "kisan", "tractor", "agri"]):
                    continue

                # Must be loan related
                if not any(word in name_lower for word in ["loan", "credit", "finance"]):
                    continue

                # Remove junk
                junk_words = [
                    "apply", "click", "faq", "video",
                    "login", "signup", "home",
                    "policy", "terms", "about"
                ]

                if any(j in name_lower for j in junk_words):
                    continue

                # Remove too long or weird text
                if len(name.split()) > 10:
                    continue

                loans.append({
                    "name": f"SBI {name}",
                    "name_hi": f"एसबीआई {name}",
                    "bank": "SBI",
                    "purpose": "Agriculture loan support",
                    "purpose_hi": "कृषि ऋण सहायता",
                    "eligibility": "Farmers with valid land documents",
                    "eligibility_hi": "वैध भूमि दस्तावेज़ वाले किसान",
                    "documents": ["Aadhaar", "Land Proof"],
                    "documents_hi": ["आधार", "भूमि प्रमाण"],
                    "official_website": sbi_url,
                    "image": "/images/sbi.png"
                })

        else:
            print("SBI request failed:", response.status_code)

    except Exception as e:
        print("SBI scraping failed:", e)

    print("Fetched SBI loans:", len(loans))
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

def run_sbi_agent():
    loans = fetch_sbi_loans()
    inserted_count = 0

    for loan in loans:

        print("VALIDATING:", loan["name"])  # DEBUG

        # AI VALIDATION
        if not validate_loan(loan["name"]):
            print("Rejected by AI:", loan["name"])
            continue

        # Duplicate checks
        if loan_exists(loan["name"]):
            print("Already in main table:", loan["name"])
            continue

        if request_exists(loan["name"]):
            print("Already in request table:", loan["name"])
            continue

        # Insert
        insert_loan_request(loan)
        inserted_count += 1
        print("Request Added:", loan["name"])

    print("SBI request inserted count:", inserted_count)
    return inserted_count