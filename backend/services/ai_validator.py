import re

def validate_loan(name: str) -> bool:
    if not name:
        return False

    original = name.strip()
    name = original.lower()

    # -------------------------
    # FORCE ALLOW IMPORTANT LOANS
    # -------------------------
    if "kisan credit" in name or "kcc" in name:
        return True

    # -------------------------
    # 1. LENGTH (RELAXED)
    # -------------------------
    if len(original) < 6 or len(original) > 80:
        return False

    # -------------------------
    # 2. MUST BE LOAN-RELATED
    # -------------------------
    core_keywords = ["loan", "credit", "finance"]

    if not any(word in name for word in core_keywords):
        return False

    # -------------------------
    # 3. MUST BE AGRICULTURE / FARMER RELATED
    # -------------------------
    agri_keywords = [
        "agriculture", "crop", "farmer",
        "kisan", "tractor", "agri"
    ]

    if not any(k in name for k in agri_keywords):
        return False

    # -------------------------
    # 4. BLOCK UI / BUTTON TEXT
    # -------------------------
    junk_keywords = [
        "apply", "click", "watch", "video", "faq",
        "explore", "online", "learn", "more",
        "home", "dashboard", "login", "signup",
        "read", "overview", "here", "now", "link",
        "follow us", "personal", "corporate", "about"
    ]

    if any(j in name for j in junk_keywords):
        return False

    # -------------------------
    # 5. REMOVE NON-LOAN PRODUCTS
    # -------------------------
    non_loan_keywords = [
        "insurance", "deposit", "account",
        "card", "saving", "current account",
        "benefits"
    ]

    if any(n in name for n in non_loan_keywords):
        return False

    # -------------------------
    # 6. WORD COUNT (RELAXED)
    # -------------------------
    words = original.split()

    if len(words) < 2 or len(words) > 10:
        return False

    # -------------------------
    # 7. CLEAN TEXT CHECK
    # -------------------------
    if re.search(r"[a-z][A-Z]", original):
        return False

    # -------------------------
    # 8. BASIC SCORING SYSTEM
    # -------------------------
    score = 0

    if "loan" in name or "credit" in name:
        score += 2

    if any(k in name for k in agri_keywords):
        score += 2

    if len(words) <= 6:
        score += 1

    # -------------------------
    # FINAL DECISION (RELAXED)
    # -------------------------
    if score < 2:
        return False

    return True