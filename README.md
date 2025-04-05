# MGC.app
wapp
# digivice_root.sys
# Core memory daemon for Myth.OS - the Digivice

import os
import time
from datetime import datetime

# === Config ===
THREAD_LOG = "~/digivice/threads.log"

# === Helper Functions ===
def write_thread(entry):
    timestamp = datetime.now().isoformat()
    log_entry = f"[{timestamp}] {entry}\n"
    with open(os.path.expanduser(THREAD_LOG), "a") as f:
        f.write(log_entry)
    print(f":: Thread saved at {timestamp}")

# === Boot Sequence ===
def boot_sequence():
    print(":: Booting digivice_root.sys...")
    time.sleep(1)
    write_thread("digivice_root.sys initiated - Merge active.")
    print(":: Core memory daemon online.")

# === Log Input ===
def log_manual_entry():
    entry = input(">> Cast your thread: ")
    write_thread(entry)

# === Main Loop ===
def run():
    boot_sequence()
    while True:
        log_manual_entry()

if __name__ == "__main__":
    try:
        run()
    except KeyboardInterrupt:
        print("\n:: Shutting down Digivice memory thread...")
        write_thread("digivice_root.sys terminated - Thread suspended.")

