//It appears that you're interested in my code...
//
// Email erxu@ctemc.org (and screenshot this) if you want to work with me. :)
// 
let id = -1;
function run() {
  var firebaseConfig = {
    // 
    apiKey: "AIzaSyCz8S0hkXh7i_5KcdyLUxBVq5YQhoPxiaw",
    authDomain: "srp1-ab420.firebaseapp.com",
    databaseURL: "https://srp1-ab420.firebaseio.com",
    projectId: "srp1-ab420",
    storageBucket: "srp1-ab420.appspot.com",
    messagingSenderId: "621543914901",
    appId: "1:621543914901:web:686b83863d31285605ca9c",
    measurementId: "G-6H69F7QZ2G"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      user.providerData.forEach(function(profile) {
        id = user.uid;
      });

      let ref = firebase
        .storage()
        .ref()
        .child(id + "/");
      ref.listAll().then(function(res) {
        if (res.items.length) {
          $("#header").html(`          <a
            target="_blank"
            href="https://cdn.glitch.com/a7fe7389-b199-4059-9b1e-4e0edb35a775%2FConsent%20Form1.pdf?v=1605467307433"
            >Consent Form Link</a
          >`);
          $("#bottom").text(
            "Note: submitting a new file will override your previous submission"
          );
          showSlide(2);
        } else {
          showSlide(1);
        }
      });
    } else {
      showSlide(0);
    }
  });

  $("#submit-file").on("change", async e => {
    let file = e.target.files[0];
    if (file) {
      let ref = firebase.storage().ref(id + "/" + "form");

      let task = ref.put(file);
      $("progress").css("height", "0");
      $("#submit-file").css("width", "50%");
      $();
      await wait(50);
      $("progress").css("height", "30px");
      await wait(200);
      task.on(
        "state_changed",
        s => {
          $("#upload-stat").val((s.bytesTransferred / s.totalBytes) * 100);
        },
        e => {
          $("#error").html(e);
        },
        async () => {
          showSlide(2);
          await wait(500);
          $("#submit-file").css("width", "180px");
          $("progress").css("height", "0");
          $("#upload-stat").val(0);
        }
      );
    }
  });
}
async function showSlide(s) {
  hideLoader();
  $(".container").css("opacity", 0);
  await wait(200);
  $(".container").css("display", "none");

  $("#" + s).css("display", "flex");
  $("#" + s).css("opacity", 0);
  await wait(100);
  $("#" + s).css("opacity", 1);
}
function wait(m) {
  return new Promise(r => {
    setTimeout(r, m);
  });
}
function hideLoader() {
  $("#loading").hide();
}
function signUp() {
  //listenForCallback();
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}
