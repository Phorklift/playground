function updateState(action)
{
  var t = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  document.getElementById("state").value = action + " at " + t
}

function queryConf()
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      document.getElementById("conf").value = this.responseText;
      updateState("Reset")
    }
  };

  xhttp.open("GET", "conf/", true);
  xhttp.send();
}

function queryExample()
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      document.getElementById("conf").value = this.responseText;
      updateState("Query example")
    }
  };

  var exampleSelect = document.getElementById("exampleSelect");
  var index = exampleSelect.selectedIndex;
  if (index == 0) {
    return;
  }
  var example = exampleSelect.options[index].text;
  xhttp.open("GET", "examples/" + example, true);
  xhttp.send();
}

function uploadConf()
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState != 4) {
      return;
    }
    if (this.status == 201) {
      updateState("Upload")
    } else {
      window.alert("Upload fails: " + this.responseText)
    }
  };

  var body = document.getElementById("conf").value;
  if (!body) {
      window.alert("Empty configuration!");
      return;
  }
  xhttp.open("POST", "conf/", true);
  xhttp.send(body)
}

function sendRequest()
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState != 4) {
      return;
    }
    var out = 'status: ' + this.status + '\n' + this.getAllResponseHeaders();
    document.getElementById("response_headers").innerHTML = out;
    document.getElementById("response_body").innerHTML = this.responseText;
  };

  var url = "req/" + document.getElementById("req_url").value;
  var body = document.getElementById("req_body").value;
  var method = body ? "POST" : "GET";
  var hname = document.getElementById("req_hname").value;
  var hvalue = document.getElementById("req_hvalue").value;

  xhttp.open(method, url, true);
  if (hname) {
    xhttp.setRequestHeader(hname, hvalue)
  }
  xhttp.send(body);
}

function fillExamplesSelect()
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState != 4) {
      return;
    }
    var exampleSelect = document.getElementById('exampleSelect');
    var examples = this.responseText.split('\n');
    examples = examples.sort()
    for (var i = 0; i < examples.length; i++) {
      if (examples[i] == '') continue;
      exampleSelect.add(new Option(examples[i]));
    }
  };
  xhttp.open("GET", "examples/", true);
  xhttp.send();
}

fillExamplesSelect();
queryConf()
