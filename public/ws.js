var prot = "ws://";
var username="";
var messages=[];
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
    document.getElementById("errormessage").style="display:block";
    document.getElementById("okmessage").style="display:none";
    console.error("WebSocket disconnected retry");
    conn = false;
    reconn();
  };
  connection.onmessage = e => {
    console.log("Incoming Message: " + e.data);
    const datas = JSON.parse(e.data);
    if (datas.action === "welcome") {
      document.getElementById("errormessage").style="display:none";
    document.getElementById("okmessage").style="display:block";
      console.info("Connected");
      username=datas.data;
      document.getElementById("formdsj").onsubmit=()=>{
        const valumse=document.getElementById("inputmsg").value;
        document.getElementById("inputmsg").value="";
        if(valumse!=""){
        connection.send(JSON.stringify({"action":"push","user":username,"data":valumse}));
        }
        return false;
      };
      document.getElementById("userid").innerText="Your Username:\n"+username;
    } else if(datas.action === "recieve"){
      const parsed=datas.user+"\t:\t"+datas.data+"\n";
      messages.push(parsed);
      document.getElementById("msgs").innerText=messages.reverse().join("");
    }else if(datas.action === "join"){
      const parsed=datas.user+" joined!\n";
      messages.push(parsed);
      document.getElementById("msgs").innerText=messages.reverse().join("");
    }else {
      console.warn("Something went Wrong");
    }
  };
}
reconn();
