# Gap Shap

A full-stack WebRTC meeting app using React/Vite, Node.js, Socket.IO and browser WebRTC APIs.

## 1. Run on your laptop

From the project root:

```powershell
npm.cmd install
npm.cmd run install:all
npm.cmd run dev
```

Open `http://localhost:5173` on the laptop.

## 2. Test another device on the same Wi-Fi

The signaling server listens on `0.0.0.0:3001`, and the client automatically uses the hostname of the page it was loaded from. You do NOT need to hard-code `localhost` in `main.jsx`.

Find your laptop IPv4:

```powershell
ipconfig
```

Suppose it is `192.168.1.20`. On the phone, open:

`http://192.168.1.20:5173`

Both devices must be on the same Wi-Fi. Allow Node.js through Windows Defender Firewall on Private networks if Windows asks.

## 3. Important: phone camera/microphone

Browsers require a secure context (HTTPS) for camera/microphone on normal LAN addresses. `localhost` is a special exception, but `http://192.168.x.x:5173` generally is not.

For the most reliable phone test, expose the Vite app through an HTTPS development tunnel such as ngrok or Cloudflare Tunnel. When the phone opens the HTTPS URL, the client automatically derives the Socket.IO server from the same hostname, so both devices use the same signaling host.

If you use a tunnel only for the frontend, make sure port 3001 is also reachable through the same HTTPS host or configure a reverse proxy so `/socket.io` reaches port 3001. A simple production deployment should put the client and signaling server behind one HTTPS domain.

## 4. Test sequence

1. Start the app on the laptop.
2. Create a meeting and note the 6-character ID.
3. Join the same ID from the phone.
4. Allow camera + microphone on both devices.
5. Test mute/unmute.
6. Test camera off/on.
7. Send chat messages in both directions.
8. Raise hand and react.
9. Test screen sharing from the laptop. Mobile browsers often do not support screen sharing; that is a browser limitation.
10. Test recording on the laptop. It records the local media stream in this implementation.

## 5. WebRTC note

STUN servers are included. For users on different networks or restrictive NAT/firewalls, add a TURN server for production reliability.
