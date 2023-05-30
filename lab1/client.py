import socket
import select
import time
import sys

HEADER = 64
PORT = 5050
IP = socket.gethostbyname(socket.gethostname())
ADDR = (IP, PORT)
FORMAT = "utf-8"
DISCONNECT_MESSAGE = "DISCONNECT"
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(ADDR)


def send_msg(msg):
    message = msg.encode(FORMAT)
    msg_length = str(len(message)).encode(FORMAT)
    send_length = msg_length + b' ' * (HEADER - len(msg_length))
    client.send(send_length)
    client.send(message)
    

def get_msg():
    msg_length = client.recv(HEADER).decode(FORMAT)
    
    if msg_length:
        msg = client.recv(int(msg_length)).decode(FORMAT)
        return msg


while True:
    socket_list = [sys.stdin, client]
		
    # Get the list sockets which are readable
    read_sockets, write_sockets, error_sockets = select.select(socket_list , [], [])

    for socket in read_sockets:
        if socket == client:
            msg = get_msg()
            print(msg)
        else:
            msg = sys.stdin.readline()
            
            if msg == "exit\n":
                print("Sucessfylly disconnected")
                send_msg(DISCONNECT_MESSAGE)
                exit(0)

            send_msg(msg)
            MESSAGE_COUNTER = get_msg()
            sys.stdout.write(f"[MSG_COUNTER: {MESSAGE_COUNTER}] <You>  ")
            sys.stdout.write(msg)
            sys.stdout.flush()
