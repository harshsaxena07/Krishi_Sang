from services.loan_agents.sbi_loan_agent import run_sbi_agent
from services.loan_agents.pnb_loan_agent import run_pnb_agent


def run_all_agents():
    total_inserted = 0

    print("\n--- Running SBI Agent ---")
    total_inserted += run_sbi_agent()

    print("\n--- Running PNB Agent ---")
    total_inserted += run_pnb_agent()

    print("\n==============================")
    print("TOTAL INSERTED:", total_inserted)
    print("==============================")

    return total_inserted


if __name__ == "__main__":
    run_all_agents()