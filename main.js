var myApp =
  "https://script.google.com/macros/s/AKfycbynEg8u_ES9dblD_r2diesfTQ-1lFJY4cALjXLnmt67uvdTT4Qa13e4sGk0L37Ef7qVxw/exec";
var tasks = "1dDQXBtBedQ0-2HwAs1EkBvuM5e50ulWdfd_QrKNbA7w";
var sName = "LIVECAR";
//var eDate = "Активно до: 18.08.2024";
$("#offcanvasNavbarLabel").html(sName);
//$("#dateend").html(eDate);
$(document).ready(function () {
  loadTasks();
});
var uStatus = [];
const triggerTabList = document.querySelectorAll("#nav-tab button");
triggerTabList.forEach((triggerEl) => {
  triggerEl.addEventListener("click", (event) => {
    uStatus.length = 0;
    if (triggerEl.innerText == "В роботі") {
      uStatus.push("в роботі");
    }
    if (triggerEl.innerText == "Закриті") {
      uStatus.push("виконано");
    }
    if (triggerEl.innerText == "Скасовані") {
      uStatus.push("в архів");
    }
    $("#myTable tbody").html(
      `<span class="spinner-grow spinner-grow-sm text-success" role="status" aria-hidden="true"></span>`
    );
    loadTasks();
  });
});
uStatus.push("в роботі");

function loadTasks() {
  googleQuery(tasks, "0", "D:AN", `SELECT *`);
}
function googleQuery(sheet_id, sheet, range, query) {
  google.charts.load("45", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(queryTable);

  function queryTable() {
    var opts = { sendMethod: "auto" };
    var gquery = new google.visualization.Query(
      `https://docs.google.com/spreadsheets/d/${sheet_id}/gviz/tq?gid=${sheet}&range=${range}&headers=1&tq=${query}`,
      opts
    );
    gquery.send(callback);
  }

  function callback(e) {
    if (e.isError()) {
      console.log(
        `Error in query: ${e.getMessage()} ${e.getDetailedMessage()}`
      );
      return;
    }

    var data = e.getDataTable();
    tasksTable(data);
    tasksModal(data);

    document.addEventListener("click", function (e) {
      if (!e.target.classList.contains("send-button")) {
        return;
      }
      const nameElement = e.target.getAttribute("name");
      var dadata = data.Tf[nameElement - 1].c;
      editOrder(dadata);
    });
  }
}
function tasksTable(data) {
  $("#tasksTableDiv").html(function () {
    th = `<tr class="border-bottom border-info"><th class="text-secondary">${
      data.Sf[3].label
    }</th><th class="text-secondary">${
      data.Sf[0].label + " " + data.Sf[1].label
    }</th>
    <th class="text-secondary text-truncate" style="max-width: 70px;">${
      data.Sf[13].label
    }</th>
    <th class="text-secondary text-truncate" style="max-width: 170px;">${
      data.Sf[20].label
    }</th><th class="text-secondary text-truncate" style="min-width: 120px; max-width: 180px;">${
      data.Sf[25].label
    }</th>
    <th class="text-secondary text-truncate" style="max-width: 80px;">${
      data.Sf[26].label
    }</th>
    <th style="max-width: 40px;"></th>
    <th class="text-secondary">${data.Sf[29].label}</th></tr>`;
    var tr = ``;
    var trr = ``;
    for (i = data.Tf.length - 1; i >= 0; i--) {
      var colorw =
        data.Tf[i].c[4].v == "в роботі"
          ? `class="table-success" title="в роботі"`
          : ``;

      if (data.Tf[i].c[4].v == "закупка") {
        var colorp = `class="table-secondary" title="закупка"`;
      }
      if (data.Tf[i].c[4].v == "весь документ") {
        var colorp = `class="table-light" title="весь документ"`;
      }
      if (data.Tf[i].c[4].v == "пропозиція") {
        var colorp = `title="пропозиція"`;
      }

      var textColor = uStatus == "в архів" ? `text-secondary` : ``;
      var linkColor =
        uStatus == "в архів" ? `class="link-secondary"` : `class="link-dark"`;

      if (data.Tf[i].c[4].v == uStatus && data.Tf[i].c[24].v == sName) {
        tr += `<tr ${colorw}>
        <td><a target="_blank" href="${data.Tf[i].c[2].v}" ${linkColor}>${
          data.Tf[i].c[3].v
        }</a></td>
            <td class="${textColor}">${
          data.Tf[i].c[0].f + " - " + data.Tf[i].c[1].f
        }</td>
            <td class="${textColor} text-truncate" style="max-width: 70px;">${
          data.Tf[i].c[13].v
        }</td>
            <td class="${textColor} text-start text-truncate" style="max-width: 170px;">${
          data.Tf[i].c[20].v
        }</td>
            <td class="${textColor} text-start text-truncate" style="min-width: 120px; max-width: 180px;">${
          data.Tf[i].c[25].v
        }</td>
            <td class="${textColor} text-truncate" style="max-width: 100px;"><a href="tel:+${
          data.Tf[i].c[26].v
        }" ${linkColor}>${data.Tf[i].c[26].v}</a></td>
<td style="max-width: 40px;"<div class="button-wrapper"><button class="send-button" name="${
          i + 1
        }" id="sendButton"></button></div></td>
          <td class="${textColor} text-end">${
          data.Tf[i].c[29].v + " " + data.Tf[i].c[30].v
        }</td></tr>`;
      }
      if (
        (data.Tf[i].c[4].v == "пропозиція" ||
          data.Tf[i].c[4].v == "закупка" ||
          data.Tf[i].c[4].v == "весь документ") &&
        uStatus == "в роботі" &&
        data.Tf[i].c[24].v == sName
      ) {
        trr += `<tr ${colorp}>
						<td><a target="_blank" href="${data.Tf[i].c[2].v}" class="link-secondary">${
          data.Tf[i].c[3].v
        }</a></td>
          <td class="text-secondary">${
            data.Tf[i].c[0].f + " - " + data.Tf[i].c[1].f
          }</td>
            <td class="text-secondary text-truncate" style="max-width: 70px;">${
              data.Tf[i].c[13].v
            }</td>
            <td class="text-secondary text-start text-truncate" style="max-width: 170px;">${
              data.Tf[i].c[20].v
            }</td>
            <td class="text-start text-secondary text-truncate" style="min-width: 120px; max-width: 180px;">${
              data.Tf[i].c[25].v
            }</td>
            <td class="text-secondary text-truncate" style="max-width: 100px;"><a href="tel:+${
              data.Tf[i].c[26].v
            }" class="link-secondary">${data.Tf[i].c[26].v}</a></td>
<td style="max-width: 40px;"<div class="button-wrapper"><button class="send-button" name="${
          i + 1
        }" id="sendButton"></button></div></td>
            <td class="text-end text-secondary">${
              data.Tf[i].c[29].v + " " + data.Tf[i].c[30].v
            }</td></tr>`;
      }
    }
    return `<table id="myTable" class="table text-center table-hover table-sm table-responsive text-truncate"><thead>${th}</thead><tbody>${tr}${trr}</tbody></table>`;
  });
}
var fil = [];
function myFunction() {
  fil.length = 0;
  var input, filter, table, tr, td, td1, td2, td3, td4, td5, td6, td7, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  if (filter != "") {
    fil.push("stoploadTasks");
  }

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    td1 = tr[i].getElementsByTagName("td")[1];
    td2 = tr[i].getElementsByTagName("td")[2];
    td3 = tr[i].getElementsByTagName("td")[3];
    td4 = tr[i].getElementsByTagName("td")[4];
    td5 = tr[i].getElementsByTagName("td")[5];
    td6 = tr[i].getElementsByTagName("td")[6];
    td7 = tr[i].getElementsByTagName("td")[7];
    if (td) {
      if (
        td.innerHTML.toUpperCase().indexOf(filter) > -1 ||
        td1.innerHTML.toUpperCase().indexOf(filter) > -1 ||
        td2.innerHTML.toUpperCase().indexOf(filter) > -1 ||
        td3.innerHTML.toUpperCase().indexOf(filter) > -1 ||
        td4.innerHTML.toUpperCase().indexOf(filter) > -1 ||
        td5.innerHTML.toUpperCase().indexOf(filter) > -1 ||
        td6.innerHTML.toUpperCase().indexOf(filter) > -1 ||
        td7.innerHTML.toUpperCase().indexOf(filter) > -1
      ) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
function tasksModal(data) {
  autoNum.length = 0;
  autoMake.length = 0;
  autoModel.length = 0;
  autoColor.length = 0;
  autoYear.length = 0;
  autoVin.length = 0;
  autoMileage.length = 0;
  autoClient.length = 0;
  autoPhone.length = 0;
  autoAllNum.length = 0;
  autoAllmc.length = 0;
  for (var i = 0; i < data.Tf.length; i++) {
    var swap = 0;
    var str = data.Tf[i].c[13].v;
    autoAllNum.push(data.Tf[i].c[13].v);
    autoAllmc.push(data.Tf[i].c[15].v + data.Tf[i].c[25].v);
    for (var j = i; j < data.Tf.length; j++) {
      if (data.Tf[j].c[13].v == str) {
        swap++;
      }
    }
    if (swap == 1 && data.Tf[i].c[13].v != "?") {
      autoNum.push(data.Tf[i].c[13].v);
      autoMake.push(data.Tf[i].c[14].v);
      autoModel.push(data.Tf[i].c[15].v);
      autoColor.push(data.Tf[i].c[16].v);
      autoYear.push(data.Tf[i].c[17].v);
      autoVin.push(data.Tf[i].c[18].v);
      autoMileage.push(data.Tf[i].c[12].v);
      autoClient.push(data.Tf[i].c[25].v);
      autoPhone.push(data.Tf[i].c[26].v);
    }
  }
  numCheck = data.Tf.length + 1;
  opcNum.length = 0;
  opcMake.length = 0;
  opcModel.length = 0;
  opcColor.length = 0;
  opcYear.length = 0;
  opcClient.length = 0;
  for (var i = autoNum.length - 1; i >= 0; i--) {
    opcNum.push(`<option>${autoNum[i]}</option>`);
  }

  var autoMakeUniq = [];
  for (var i = 0; i < autoMake.length; i++) {
    var swap = 0;
    var str = autoMake[i];
    for (var j = i; j < autoMake.length; j++) {
      if (autoMake[j] == str) {
        swap++;
      }
    }
    if (swap == 1 && autoMake[i] != "?") {
      autoMakeUniq.push(autoMake[i]);
    }
  }
  var autoMakeUniqSort = autoMakeUniq.sort();
  for (i = 0; i < autoMakeUniqSort.length; i++) {
    opcMake.push(`<option>${autoMakeUniqSort[i]}</option>`);
  }
  tempMake.length = 0;
  tempModel.length = 0;
  for (var i = 0; i < data.Tf.length; i++) {
    var swap = 0;
    var str = data.Tf[i].c[15].v;
    for (var j = i; j < data.Tf.length; j++) {
      if (data.Tf[j].c[15].v == str) {
        swap++;
      }
    }
    if (swap == 1 && data.Tf[i].c[15].v != "?") {
      tempMake.push(data.Tf[i].c[14].v);
      tempModel.push(data.Tf[i].c[15].v);
    }
  }

  for (var i = 0; i < tempModel.length; i++) {
    opcModel.push(`<option>${tempModel[i]}</option>`);
  }

  var autoColorUniq = [];
  for (var i = 0; i < autoColor.length; i++) {
    var swap = 0;
    var str = autoColor[i];
    for (var j = i; j < autoColor.length; j++) {
      if (autoColor[j] == str) {
        swap++;
      }
    }
    if (swap == 1 && autoColor[i] != "?") {
      autoColorUniq.push(autoColor[i]);
    }
  }
  var autoColorUniqSort = autoColorUniq.sort();
  for (i = 0; i < autoColorUniqSort.length; i++) {
    opcColor.push(`<option>${autoColorUniqSort[i]}</option>`);
  }

  var autoYearUniq = [];
  for (var i = 0; i < autoYear.length; i++) {
    var swap = 0;
    var str = autoYear[i];
    for (var j = i; j < autoYear.length; j++) {
      if (autoYear[j] == str) {
        swap++;
      }
    }
    if (swap == 1 && autoYear[i] != "0") {
      autoYearUniq.push(autoYear[i]);
    }
  }
  var autoYearUniqSort = autoYearUniq.sort();
  for (i = 0; i < autoYearUniqSort.length; i++) {
    opcYear.push(`<option>${autoYearUniqSort[i]}</option>`);
  }

  for (var i = data.Tf.length - 1; i >= 0; i--) {
    var str = data.Tf[i].c[25].v;
    var swap = 0;
    for (var j = i; j >= 0; j--) {
      if (data.Tf[j].c[25].v == str && data.Tf[i].c[25].v != "?") {
        swap++;
      }
    }
    if (swap == 1) {
      for (var n = data.Tf.length - 1; n >= 0; n--) {
        if (data.Tf[n].c[24].v == sName && data.Tf[n].c[25].v == str) {
          opcClient.push(`<option>${data.Tf[i].c[25].v}</option>`);
          break;
        }
      }
    }
  }
}
var autoNum = [],
  autoMake = [],
  autoModel = [],
  autoColor = [],
  autoYear = [],
  autoVin = [],
  autoMileage = [],
  autoClient = [],
  autoPhone = [],
  autoAllNum = [],
  autoAllmc = [];
function option() {
  var num = $("#num").val();
  var model = $("#model").val();
  var client = $("#client").val();
  function convertToLatin(str) {
    const cyrillicToLatinMap = {
      А: "A",
      В: "B",
      Е: "E",
      И: "I",
      К: "K",
      М: "M",
      Н: "H",
      О: "O",
      Р: "P",
      С: "C",
      Т: "T",
      У: "Y",
      Х: "X",
      а: "A",
      в: "B",
      е: "E",
      и: "I",
      к: "K",
      м: "M",
      н: "H",
      о: "O",
      р: "P",
      с: "C",
      т: "T",
      у: "Y",
      х: "X",
    };
    return str
      .replace(/[А-Яа-я]/g, (char) => cyrillicToLatinMap[char] || char)
      .toUpperCase();
  }
  num = convertToLatin(num);
  $("#num").val(num);

  if (num != "") {
    var allNum = autoAllNum.filter((value) => value === num).length;
    $("#allnum").html(`${allNum + 1} -й визит`);
  } else {
    var allmc = autoAllmc.filter((value) => value == model + client).length;
    $("#allnum").html(`${allmc + 1} -й визит`);
  }
  for (i = 0; i < autoNum.length; i++) {
    if (autoNum[i] == num && client == "") {
      $("#make").val(autoMake[i]);
      $("#model").val(autoModel[i]);
      $("#color").val(autoColor[i]);
      $("#year").val(autoYear[i]);
      $("#vin").val(autoVin[i]);
      $("#mileage").val(autoMileage[i]);
      $("#client").val(autoClient[i]);
      $("#phone").val(autoPhone[i]);
      break;
    }
  }
}
var tempMake = [],
  tempModel = [];
function findModel() {
  var marka = $("#make").val();
  var model = document.getElementById("character2");
  model.innerHTML = "";
  var tempModelUniq = [];
  for (i = 0; i < tempMake.length; i++) {
    if (tempMake[i] == marka) {
      tempModelUniq.push(tempModel[i]);
    }
  }
  var tempModelUniqSort = tempModelUniq.sort();
  for (i = 0; i < tempModelUniqSort.length; i++) {
    model.insertAdjacentHTML(
      "beforeend",
      "<option>" + tempModelUniqSort[i] + "</option>"
    );
  }
}
var opcNum = [],
  opcMake = [],
  opcModel = [],
  opcColor = [],
  opcYear = [],
  opcClient = [];
function newOrder() {
  const currentTime = moment().tz("Europe/Kiev");
  const vHour = currentTime.format("HH");
  const vMinutes = currentTime.format("mm");
  const vYear = currentTime.format("YYYY");
  const vMonth = currentTime.format("MM");
  const vDay = currentTime.format("DD");

  var title = `Створюємо новий візит до сервісу`;
  var buttons = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Скасувати</button>
            	   <button type="button" class="btn btn-success" onclick="addCheck()">Створити</button>`;
  $("#commonModal .modal-header .modal-title").html(title);
  $("#commonModal .modal-body").html(function () {
    return `<div class="row">
    <div class="col-6" id="allnum" name="allnum" type="text" style="color: blue; font-size: 14px; text-align: center;"></div>
<div class="col-6" style="color: red; font-size: 12px; text-align: right; margin-bottom: 10px;"><i class="fas fa-pen"></i> Запис</div>
    </div>
    <div class="row">
    <div class="col-6">
    <form class="form-floating">
    <input class="form-control" id="num" placeholder="Держ. номер авто" value="" onchange="option()" list="character">
    <label for="num">Держ. номер авто</label>
    </form>
    <datalist id="character">${opcNum}</datalist>
    </div>
    
    <div class="col-6 ms-auto">
    <form class="form-floating">
    <input type="datetime-local" id="datetime-local" class="form-control" placeholder="Час візиту" min="${vYear}-${vMonth}-${vDay} ${vHour}:${vMinutes}" value="${vYear}-${vMonth}-${vDay} ${vHour}:${vMinutes}" onchange="">
    <label for="datetime-local" class="form-label">Час візиту</label>
    </form>
    </div>
    </div>
    <div class="row text-bg-light p-2">
    <div class="col-6">    
<label for="make" class="form-label">Марка</label>
<input id="make" name="make" class="form-control form-control-sm" type="text" value="" onchange="findModel()" list="character1">
<datalist id="character1">${opcMake}</datalist></div>
<div class="col-6 ms-auto">
<label for="model" class="form-label">Модель</label>
<input id="model" name="model" class="form-control form-control-sm" type="text" value="" onchange="" list="character2">
<datalist id="character2">${opcModel}</datalist></div>
</div>
<div class="row text-bg-light">
<div class="col-6">
<label for="color" class="form-label">Колір</label>
<input id="color" name="color" class="form-control form-control-sm" type="text" value="" onchange="" list="character3">
<datalist id="character3">${opcColor}</datalist></div>
<div class="col-6 ms-auto">
<label for="year" class="form-label">Рік</label>
<input id="year" name="year" class="form-control form-control-sm" type="text" value="" onchange="" list="character4">
<datalist id="character4">${opcYear}</datalist></div></div>
<div class="row text-bg-light p-2">
<div class="col-6">
<label for="vin" class="form-label">Vin-код</label>
<input id="vin" name="vin" class="form-control form-control-sm" type="text" value="" onchange="" list="character5">
<datalist id="character5"></datalist></div>
<div class="col-6 ms-auto">
<label for="mileage" class="form-label">Пробіг</label>
<input id="mileage" name="mileage" class="form-control form-control-sm" type="text" value="" onchange="" list="character6">
<datalist id="character6"></datalist></div></div>
<div class="row">
<div class="col-6">
<label for="client" class="form-label">Клієнт</label>
<input id="client" name="client" class="form-control form-control-sm" type="text" value="" onchange="option()" list="character7">
<datalist id="character7">${opcClient}</datalist></div>
<div class="col-6 ms-auto">
<label for="phone" class="form-label">Тел. Клієнта</label>
<input id="phone" name="phone" class="form-control form-control-sm" type="text" value="" onchange="" list="character8">
<datalist id="character8"></datalist></div></div>`;
  });
  $("#commonModal .modal-footer").html(buttons);
  $("#commonModal").modal("show");
}

function editOrder(dadata) {
  var title = `<div class="row fs-6 fst-italic text-nowrap"><div class="col-2">${dadata[3].v}</div><div class="col-6 text-end">${sName}</div><div class="col-4">${dadata[0].f} - ${dadata[1].f}</div></div>`;
  var buttons = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Скасувати</button>
               <button type="button" class="btn btn-success" onclick="" disabled>Надіслати</button>`;
  $("#commonModal .modal-header .modal-title").html(title);
  $("#commonModal .modal-body").html(function () {
    return `<div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
    <div><div><strong>${dadata[14].v} ${dadata[15].v} ${dadata[16].v} ${dadata[17].v}</strong></div>
      <div>${dadata[13].v}</div>
      <div>${dadata[18].v}</div>
      <div>${dadata[12].v}</div></div>
    <div><div><strong>${dadata[25].v}</strong></div>
      <div>${dadata[26].v}</div></div>
  </div>
  <table class="table table-bordered"><tbody id="table-body"></tbody></table>
  <div><p style="text-align: right;">%<strong> &nbsp; &nbsp; &nbsp; ${dadata[30].v}: &nbsp; &nbsp; &nbsp; ${dadata[29].v} грн.&nbsp; &nbsp;</strong></p></div>`;
  });

  const data = dadata[36].v == undefined ? "немає замовлення" : dadata[36].v;
  const rows = data.split(",");
  const tableBody = document.getElementById("table-body");

  rows.forEach((row, index) => {
    const columns = row.split("|").slice(0, 4); // Выбираем только первые четыре значения
    const tr = document.createElement("tr");

    const numberCell = document.createElement("td");
    numberCell.textContent = index + 1; // Установка номера строки
    tr.appendChild(numberCell);

    columns.forEach((column) => {
      const td = document.createElement("td");
      td.textContent = column;
      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });
  $("#commonModal .modal-footer").html(buttons);
  $("#commonModal").modal("show");
}

var numCheck = ``;
function addCheck() {
  var nomer = $("#num").val();
  var visitnum =
    $("#allnum").text() == "" ? "0" : $("#allnum").text().match(/\d+/)[0];
  var record = $("#datetime-local").val();
  var make = $("#make").val() == "?" ? "" : $("#make").val();
  var model = $("#model").val() == "?" ? "" : $("#model").val();
  var color = $("#color").val() == "?" ? "" : $("#color").val();
  var year = $("#year").val() == "0" ? "" : $("#year").val();
  var vin = $("#vin").val() == "?" ? "" : $("#vin").val();
  var mileage = $("#mileage").val() == "?" ? "" : $("#mileage").val();
  var client = $("#client").val() == "?" ? "" : $("#client").val();
  var phone = $("#phone").val() == "?" ? "" : $("#phone").val();
  var action = "addCheck";
  var body = `numCheck=${encodeURIComponent(
    numCheck
  )}&nomer=${encodeURIComponent(nomer)}&visitnum=${encodeURIComponent(
    visitnum
  )}&record=${encodeURIComponent(record)}&make=${encodeURIComponent(
    make
  )}&model=${encodeURIComponent(model)}&color=${encodeURIComponent(
    color
  )}&year=${encodeURIComponent(year)}&vin=${encodeURIComponent(
    vin
  )}&mileage=${encodeURIComponent(mileage)}&client=${encodeURIComponent(
    client
  )}&phone=${encodeURIComponent(phone)}&action=${encodeURIComponent(action)}`;
  $("#commonModal .modal-body, .modal-footer").html("");
  $("#commonModal .alert-area").html(
    `<div class="alert alert-success" role="alert"><div class="spinner-border text-success" role="status"></div> В процесі....</div>`
  );
  var xhr = new XMLHttpRequest();
  xhr.open("POST", myApp, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      window.open(xhr.response);
      loadTasks();
      $(".alert").alert("close");
      $("#commonModal").modal("hide");
    }
  };
  try {
    xhr.send(body);
  } catch (err) {
    console.log(err);
  }
}

function addReportModal() {
  var title = `Створюємо звіт`;
  var buttons = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Скасувати</button>
            	   <button type="button" class="btn btn-success" onclick="addReport()">Створити</button>`;
  $("#commonReport .modal-header .modal-title").html(title);
  $("#commonReport .modal-body").html(function () {
    return `<label for="typeReport" class="form-label">Тип звіту</label>
<select id="typeReport" name="typeReport" class="form-select" type="text" value="" onchange="addInputClient()" list="characterR">
<option selected>За виконаними замовленнями</option><option>За проданими товарами</option><option>По клієнту</option></select>
<br><div id="addInput"></div><br>
<div class="row"><div class="col">
<label for="sdate" class="form-label">Дата початку</label>
<input id="sdate" name="sdate" class="form-control" type="date" placeholder="" onchange="">
</div><div class="col">
<label for="pdate" class="form-label">Дата кінець</label>
<input id="pdate" name="pdate" class="form-control" type="date" placeholder="" onchange="">
</div></div>`;
  });
  $("#commonReport .modal-footer").html(buttons);
  $("#commonReport").modal("show");
}

function addInputClient() {
  var inClient = `<div class="form-control"><label for="client" class="form-label">Вкажіть ім'я клієнта</label>
<input id="client" name="client" class="form-control form-control-sm" type="text" value="" onchange="" list="character7">
<datalist id="character7">${opcClient}</datalist></div>`;
  var typeReport = $("#typeReport").val();
  if (typeReport == "По клієнту") {
    $("#addInput").html(inClient);
  } else {
    $("#addInput").html("");
  }
}

var action = [];
function addReport() {
  var typeReport = $("#typeReport").val();
  action.length = 0;
  if (typeReport == "За виконаними замовленнями") {
    action.push("reportVal");
  }
  if (typeReport == "За проданими товарами") {
    action.push("reportGoods");
  }
  if (typeReport == "По клієнту") {
    action.push("reportClient");
  }
  var sdate = $("#sdate").val();
  var pdate = $("#pdate").val();
  var client = $("#client").val();

  var body = `sdate=${encodeURIComponent(sdate)}&pdate=${encodeURIComponent(
    pdate
  )}&client=${encodeURIComponent(client)}&action=${encodeURIComponent(action)}`;
  $("#commonReport .modal-body, .modal-footer").html("");
  $("#commonReport .alert-area").html(
    `<div class="alert alert-success" role="alert"><div class="spinner-border text-success" role="status"></div> В процесі....</div>`
  );
  var xhr = new XMLHttpRequest();
  xhr.open("POST", myApp, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      if (xhr.response == "nofind") {
        $("#commonReport .alert-area").html(
          `<div class="alert alert-warning" role="alert">Нічого не знайдено!<br>Виберіть іншу дату.</div>`
        );
        setTimeout(() => {
          $(".alert").alert("close");
          addReportModal();
        }, 2000);
        return;
      } else {
        window.open(xhr.response);
      }
      $(".alert").alert("close");
      $("#commonReport").modal("hide");
    }
  };
  try {
    xhr.send(body);
  } catch (err) {
    console.log(err);
  }
}
setInterval(() => {
  if (fil == "stoploadTasks") return;
  loadTasks();
}, 10000);
