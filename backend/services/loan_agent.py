import feedparser
import requests
from bs4 import BeautifulSoup
from db import get_db_connection


def fetch_external_loans():
    loans = []

    # COMMON FILTER KEYWORDS (reused for both PIB + SBI)
    farmer_keywords = ["farmer", "kisan", "agriculture", "crop", "farming", "agri"]
    loan_keywords = ["loan", "credit", "finance", "scheme"]
    exclude_keywords = ["education", "student", "startup", "urban"]

    # ---------------------------
    # 1. GOVERNMENT (RSS SOURCE)
    # ---------------------------
    try:
        url = "https://www.pib.gov.in/RssMain.aspx?ModId=3&Lang=1&Regid=3"
        feed = feedparser.parse(url)

        for entry in feed.entries:
            title = entry.get("title", "")
            summary = entry.get("summary", "")
            link = entry.get("link", "")

            title_lower = title.lower()
            summary_lower = summary.lower()

            # Skip unwanted
            if any(bad in title_lower for bad in exclude_keywords):
                continue

            # Apply farmer + loan filter
            if (
                any(fk in title_lower or fk in summary_lower for fk in farmer_keywords)
                and
                any(lk in title_lower or lk in summary_lower for lk in loan_keywords)
            ):
                loans.append({
                    "name": title,
                    "name_hi": title,
                    "bank": "Government",
                    "purpose": summary[:200],
                    "purpose_hi": summary[:200],
                    "eligibility": "Check official website",
                    "eligibility_hi": "आधिकारिक वेबसाइट देखें",
                    "documents": ["Aadhaar", "Bank Account"],
                    "documents_hi": ["आधार", "बैंक खाता"],
                    "official_website": link,
                    "image": "/images/default-loan.jpg"
                })

    except Exception as e:
        print("RSS fetch failed:", e)

    # ---------------------------
    # 2. SBI BANK SCRAPING
    # ---------------------------
    try:
        sbi_url = "https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan"
        response = requests.get(sbi_url, timeout=10)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            headings = soup.find_all("h3")

            for h in headings:
                name = h.get_text(strip=True)

                if len(name) > 5:
                    name_lower = name.lower()

                    # ❗ APPLY SAME FILTER HERE
                    if any(bad in name_lower for bad in exclude_keywords):
                        continue

                    if (
                        any(fk in name_lower for fk in farmer_keywords)
                        and
                        any(lk in name_lower for lk in loan_keywords)
                    ):
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
                            "image": "/images/sbi.jpg"
                        })

        else:
            print("SBI request failed:", response.status_code)

    except Exception as e:
        print("SBI scraping failed:", e)

    # ---------------------------
    # 3. CLEAN
    # ---------------------------
    if len(loans) == 0:
        print("No farmer-related loan data found")

    print("Fetched loans:", len(loans))
    return loans


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


def insert_loan(loan):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO loans 
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


def run_loan_agent():
    external_loans = fetch_external_loans()
    inserted_count = 0

    print("Fetched loans:", len(external_loans))

    for loan in external_loans:
        if not loan_exists(loan["name"]):
            insert_loan(loan)
            inserted_count += 1
            print("Inserted:", loan["name"])
        else:
            print("Skipped (already exists):", loan["name"])

    return inserted_count