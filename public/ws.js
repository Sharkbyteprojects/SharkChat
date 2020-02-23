var prot = "ws://";
const head =
  '<table class="table table-hover"><thead><tr><th>user</th><th>message</th></tr></thead><tbody>';
const end = "</tbody></table>";
var username = "";
const cleanseString = string => {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
var messages = [];
if (document.location.protocol == "https:") {
  prot = "wss://";
  console.info("Secure Websocket");
}
const url = prot + document.location.host + "/student/provider/securesock";
console.info("Connect with WebSocket");
var conn = false;
function reconn() {
  const connection = new WebSocket(url);
  connection.onerror = error => {
    console.error("WebSocket disconnected retry");
    document.getElementById("errormessage").style = "display:block";
    document.getElementById("okmessage").style = "display:none";
    conn = false;
    reconn();
  };
  connection.onmessage = e => {
    console.log("Incoming Message: " + e.data);
    /*
    This Scipt it Sharkbytes Property!
    */
    const datas = JSON.parse(e.data);
    if (datas.action === "welcome") {
      document.getElementById("errormessage").style = "display:none";
      document.getElementById("okmessage").style = "display:block";
      console.info("Connected");
      username = datas.data;
      document.getElementById("formdsj").onsubmit = () => {
        const valumse = document.getElementById("inputmsg").value;
        document.getElementById("inputmsg").value = "";
        if (valumse != "") {
          connection.send(
            JSON.stringify({ action: "push", user: username, data: valumse })
          );
        }
        return false;
      };
      document.getElementById("userid").innerText =
        "Your Username:\n" + username;
    } else if (datas.action === "recieve") {
      const parsed ="<tr><td>"+
        cleanseString(datas.user) + "</td><td>" + cleanseString(datas.data) + "</td></tr>";
      messages.push(parsed);
      const clone = messages;
      document.getElementById("msgs").innerHTML = head + clone.join("")+end;
    } else if (datas.action === "join") {
      const parsed = "<tr class=\"joins\"><td></td><td>"+cleanseString(datas.user) + " joined!</td></tr>";
      messages.push(parsed);
      const clone = messages;
      document.getElementById("msgs").innerHTML = head + clone.join("")+end;
    } else if (datas.action === "Spam") {
      const parsed =
        "<tr class=\"serverspama\"><td>Server</td><td>She sent the same one too many times. To avoid spam, your message was not sent.</td></tr>";
      messages.push(parsed);
      const clone = messages;
      document.getElementById("msgs").innerHTML = head + clone.join("")+end;
    } else {
      console.warn("Something went Wrong");
    }
  };
}
reconn();
