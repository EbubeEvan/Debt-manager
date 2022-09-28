class DM{
    constructor(){
      this.alert = document.querySelector(".alert");  
      this.newDebtSub = document.querySelector(".new-debtsub")
      this.newForm = document.querySelector(".new");
      this.newTitle = document.querySelector(".title");
      this.newAmount = document.querySelector(".amount");
      this.btn1 = document.querySelector(".btn1");
      this.myTitle = document.querySelector(".my-title");
      this.myForm = document.querySelector(".update");
      this.newPayment = document.querySelector(".new-payment");
      this.totalPayment = document.querySelector(".total-payment");
      this.balance = document.querySelector(".balance");
      this.debt = document.querySelector(".debt");
      this.btn2 = document.querySelector(".btn2");
      this.recordsList = document.getElementById("recordsList");
      this.recordArr = [];
      this.totalPaymentAmount = 0;
    }

    //submit debt method
    submitDebt(){
      const titleValue = this.newTitle.value;
      const amountValue = this.newAmount.value;
      if(titleValue === "" || amountValue === "" || amountValue < 0){
      this.alert.classList.remove("active");
      this.newDebtSub.classList.add("active");
      
      const inner = this;

      setTimeout(() => {
        inner.alert.classList.add("active")
        this.newDebtSub.classList.remove("active")
      }, 3000)
      } else {
        const amountOwed = parseInt(amountValue);
        // id assignment
         let set = JSON.parse(localStorage.getItem("recordArr"));
           if (set?.length) {
          this.recordId = set[set.length - 1].id + 1;
         } else {
          this.recordId = 1
         }
          
        const record = {
          id : this.recordId,
          title: titleValue,
          amount : amountOwed,
          totalPayment : "",
          balance: "",
        }
        this.recordId++;

        let book = localStorage.getItem("recordArr");
        if( book ){
          this.recordArr = JSON.parse(book);
          this.addToStorage(record)
        } else {
          this.addToStorage(record)
        }
        this.createRecord(record);
        this.newTitle.value = "";
        this.newAmount.value = "";
      }
    }
    //add to storage
    addToStorage(record){
      this.recordArr.push(record);
      localStorage.setItem("recordArr", JSON.stringify(this.recordArr));
    }
    //createRecord
    createRecord(record){
      const div = document.createElement("div");
      div.classList.add("saved-records");
      div.innerHTML =` <div class="name" data-id="${record.id}">${record.title}</div>
      <div class="delete" data-id="${record.id}">
          <i class="fa-solid fa-trash-can"></i>
      </div>`
      this.recordsList.appendChild(div);
    }

    //edit debt method
    editDebt(element){
      let id = parseInt(element.dataset.id);
      this.activeRecordId = id
      //fetch record
      this.recordArr = JSON.parse(localStorage.getItem("recordArr"));
      let record = this.recordArr.filter((item) => item.id === id);
     // show values
      this.myTitle.textContent = record[0].title
      this.debt.textContent= record[0].amount
      this.totalPayment.textContent = record[0].totalPayment
      this.balance.textContent = record[0].balance
    } 

    //new Pay method
    newPay(){
       const record = this.getRecord(this.activeRecordId);
       const currentPayment = Number(record.totalPayment);
       const newPayment = Number(this.newPayment.value);

       this.totalPayment.textContent = currentPayment + newPayment;

       if (isNaN(this.totalPayment.textContent)){
        this.totalPayment.textContent = 0
       }

       this.balance.textContent = Number(this.debt.textContent) - Number(this.totalPayment.textContent);
    }

    getRecord(recordId){
      const records = JSON.parse(localStorage.getItem("recordArr"));
      const id = parseInt(recordId);
      return records.find(record => record.id === id);
    }
  
    //update debt method
    updateDebt(){
      // fetch record
      const allRecords = JSON.parse(localStorage.getItem("recordArr"));
      const activeRecord = allRecords.find(record => record.id === this.activeRecordId);

      activeRecord.totalPayment = this.totalPayment.textContent;
      activeRecord.balance = this.balance.textContent;

      localStorage.setItem("recordArr", JSON.stringify(allRecords));

        this.myTitle.textContent = "Name"
        this.newPayment.value = "";
        this.totalPayment.textContent = "0";
        this.balance.textContent = "0";
        this.debt.textContent = "0";
    }

    //delete debt method
    deleteDebt(element){
      let id = parseInt(element.dataset.id);
      //remove from dom
      let parent = element.parentElement;
      this.recordsList.removeChild(parent);
      //remove from list
      this.recordArr = JSON.parse(localStorage.getItem("recordArr"));
      let tempArr = this.recordArr.filter((item) => item.id !== id);
      // remove from local storage
      this.recordArr = tempArr;
      localStorage.setItem("recordArr", JSON.stringify(this.recordArr));
    }
}
 
function eventListeners(){
  const newFormEl = document.querySelector(".new");
  const myFormEl = document.querySelector(".update");
  const recordEl = document.getElementById("recordsList");
  const newPaymentEl = document.querySelector(".new-payment");
   
  //new instance of DM
  const dm = new DM();

  //New debt submit
  newFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    dm.submitDebt();
  })

  //edit debt
  recordEl.addEventListener("click", (event) => {
    if ( event.target.classList.contains("name") ){
      dm.editDebt(event.target);
    } else if (event.target.parentElement.classList.contains("delete")){
      dm.deleteDebt(event.target.parentElement)
    }
  })

  //new payment
newPaymentEl.addEventListener("keyup", () => {
 dm.newPay();
})

 //update submit
 myFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  dm.updateDebt()
})
}

document.addEventListener("DOMContentLoaded", () => {
  eventListeners();
  let books;
  if(JSON.parse(localStorage.getItem("recordArr")) === null){
    books = []
  } else {
    books = JSON.parse(localStorage.getItem("recordArr"));
  }
books.forEach( function(record){
    const div = document.createElement("div");
      div.classList.add("saved-records");
      div.innerHTML =` <div class="name" data-id="${record.id}">${record.title}</div>
      <div class="delete" data-id="${record.id}">
          <i class="fa-solid fa-trash-can"></i>
      </div>`
      this.recordsList.appendChild(div);
  })
})
