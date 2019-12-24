(function($){
  $(function(){

    $('.sidenav').sidenav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space


document.querySelector('.sidenav-trigger').addEventListener('click', (e) => {
  console.log(e.target.value)
})