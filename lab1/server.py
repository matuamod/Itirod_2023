import socket
import threading

HEADER = 64
PORT = 5050
IP = socket.gethostbyname(socket.gethostname())
ADDR = (IP, PORT)
"""FORMAT for encode/decode"""
FORMAT = "utf-8"
DISCONNECT_MESSAGE = "DISCONNECT"
MESSAGE_COUNTER = 1
clients = list()

"""Create socket for server"""
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
"""Configure socket"""
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
"""Create connection for listening that port(IP, PORT)"""
server.bind(ADDR)


def handle_client(connection, address):
    print(f"[NEW CONNECTION] {address} connected.")
    connected = True

    while connected:
        msg_length = connection.recv(HEADER).decode(FORMAT)

        if msg_length:
            global MESSAGE_COUNTER 
            msg = connection.recv(int(msg_length)).decode(FORMAT)

            if msg == DISCONNECT_MESSAGE:
                clients.remove(connection)
                connected = False
                break
            else:
                send_msg(connection, str(MESSAGE_COUNTER))

            print(f"[{address}] {msg}")
            """Send message to another client"""
            correct_msg = f"[MSG_COUNTER: {MESSAGE_COUNTER}] <" + address[0] + ">  " + msg
            MESSAGE_COUNTER += 1 
            broadcast(connection, correct_msg)

    print(f"[WARNING] Closing connection with {address[0]}")
    connection.close()


def broadcast(connection, msg):
    for client in clients:
        
        if client != connection:
            try:
                send_msg(client, msg)
            except:
                client.close()
                clients.remove(client)


def send_msg(connection, msg):
    message = msg.encode(FORMAT)
    msg_length = str(len(message)).encode(FORMAT)
    send_length = msg_length + b' ' * (HEADER - len(msg_length))
    connection.send(send_length)
    connection.send(message)


def start():
    """Start server listening requests"""
    server.listen()
    print(f"[LISTENING] Server is listening on {IP}")

    while True:
        """Apply for new client connection"""
        connection, address = server.accept()
        """Queue for communication between clients"""
        """Append new connection to the list of clients"""
        clients.append(connection)
        """Create new thread for connection"""
        thread = threading.Thread(target=handle_client, args=(connection, address))
        """Start handle_client method in new thread"""
        thread.start()
        print(f"[ACTIVE CONNECTIONS] {threading.active_count() - 1}")


print("[STARTING] server is starting...")
start()