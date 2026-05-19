import subprocess

try:
    status = subprocess.check_output(["git", "status"], stderr=subprocess.STDOUT, text=True)
    diff = subprocess.check_output(["git", "diff"], stderr=subprocess.STDOUT, text=True)
    log = subprocess.check_output(["git", "log", "-n", "5", "--oneline"], stderr=subprocess.STDOUT, text=True)
    with open("git_output.txt", "w", encoding="utf-8") as f:
        f.write("=== STATUS ===\n")
        f.write(status)
        f.write("\n=== LOG ===\n")
        f.write(log)
        f.write("\n=== DIFF ===\n")
        f.write(diff)
except Exception as e:
    with open("git_output.txt", "w", encoding="utf-8") as f:
        f.write(f"Error: {str(e)}")
