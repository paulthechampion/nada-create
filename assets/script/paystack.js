const price = $("#total-price").val()




const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener("submit", payWithPaystack, false);
function payWithPaystack(e) {
e.preventDefault();

let handler = PaystackPop.setup({
key: 'pk_test_afb32a36a1a98f774b6840be0d8717cbef008d0f',
email: document.getElementById("email-address").value,
amount: price * 100,
ref: ''+Math.floor((Math.random() * 1000000000) + 1), 
onClose: function(){
alert('Window closed.');
},
callback: function(response) {
    $.ajax({ 
        url: '/store/checkout',
        type: 'POST',
        cache: false, 
        data:{ 
            customerRef: response.reference,
            firstName:document.getElementById("first-name").value ,
            lastName:document.getElementById("last-name").value,
            email:document.getElementById("email-address").value,
            address:document.getElementById("address").value
            },
       /* success: function(data){
           alert('Success!')
        }
        , error: function(jqXHR, textStatus, err){
            alert('text status '+textStatus+', err '+err)
        }*/
     })
     
     window.location = "/store/order/"+response.reference ;
     
    }



});

handler.openIframe();
}


