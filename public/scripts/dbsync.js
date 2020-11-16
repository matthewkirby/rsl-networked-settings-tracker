// User ID
var uid = undefined;
// Room ID
var roomid = location.pathname.replace(/\/$/, "").split("/").pop().toLowerCase();
// var g_password = location.search.replace(/\/$/, "").split("?").pop().toLowerCase();

// if (g_password && g_password.length > 4 && g_password.includes("password=")) {
//     g_password = g_password.substr(g_password.indexOf('=') + 1);
//     console.log("Password override: ", g_password);
// } else 
//     g_password = "";

var authAttempted = false;
// Database root reference
var rootRef = {};


// Function called when page is first opened to log into db via anonymous uid
function init(callback) {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            uid = user.uid;
            rootRef = firebase.database().ref('games/' + roomid);
            callback();
        } 
        else {
            console.log("Auth state not logged in");
            if(authAttempted) return;
            authAttempted = true;
            firebase.auth().signInAnonymously().catch(function(error) {
                console.log(error);
            });
        }
    });
}

function init_tracker() {
    var initialized = null;
    rootRef.child('settings').on('child_added', function (data) {
      setItemState(data.key, data.val());
    });
    rootRef.child('settings').on('child_changed', function (data) {
      setItemState(data.key, data.val());
    });
    rootRef.child('settings').on('child_removed', function (data) {
      setItemState(data.key, false);
    });
  
    // rootRef.child('items').on('value', function (snapshot) {
    //   roomCreated = !!snapshot.val();
    // });
    rootRef.child('owner').on('value', function (data) {
      initialized = !!data.val();
      document.getElementById('notInitialized').hidden = initialized;
      document.getElementById('setPasscode').innerText = initialized ? 'Enter passcode' : 'Initialize room w/passcode';
      document.getElementById('ownerControls').hidden = !(initialized && (data.val() === uid));
    });
    // if (g_password !== "") {
    //   console.log("attempting auto login - please wait a few seconds!");
    // }
    // setTimeout(() => {
    //   if (g_password === "")
    //     return;
    //   if (initialized == false) //create room
    //   {
    //     console.log("attempt to create room");
    //     var editors = {};
    //     editors[uid] = true;
    //     rootRef.set({
    //       owner: uid,
    //       passcode: g_password,
    //       editors: editors
    //     });
    //     console.log("Created new due password set in url");
    //   }
    //   else //add to editors if room already exists
    //   {
    //     rootRef.child('editors').child(uid).set(g_password, function (error) {
    //       if (error) {
    //         console.log("Did not add to editors on page load");
    //         console.log(error);
    //       }
    //       else {
    //         console.log("Added to editors successfully due password set in url");
    //       }
    //     });
    //   }
    //   rootRef.child('owner').on('value', function (data) {
    //     document.getElementById('notInitialized').hidden = initialized;
    //     document.getElementById('setPasscode').style.visibility = (initialized) ? "hidden" : "visible";
    //     document.getElementById('passcode').hidden = initialized
    //     document.getElementById('ownerControls').hidden = !(initialized && (data.val() === uid));
    //   });
  
  
    // }, 4000);
  }




















// Set the room password
function set_password() {
    var passcode = document.getElementById("password").value;
    if(document.getElementById('notInitialized').hidden) {
        rootRef.child('editors').child(uid).set(passcode);
    } 
    else {
        var editors = {};
        editors[uid] = true;
        rootRef.set({
            owner: uid,
            passcode: passcode,
            editors: editors
        });
    }
}

// Destroy the database entry including owner and authorized users
function destroy_firebase() {
    rootRef.set({});
}

// Reset database to defaults
function reset_firebase() {
    rootRef.child('settings').set({});
}

// Update the item states. Triggers on child_added, child_changed and child_removed
function setItemState(elementid, state) {
    var element = document.getElementById(elementid);
    if(element.classList.contains("toggleable") || element.classList.contains("classless-toggle")) {
        if(state)
            element.classList.remove("toggle-off");
        else
            if(!element.classList.contains("toggle-off"))
                element.classList.add("toggle-off");
    }
    else if(element.classList.contains("progressive")) {
        element.innerHTML = progdict[elementid][state];
        if(state === 0 && !element.classList.contains("toggle-off"))
            element.classList.add("toggle-off");
        if(state !== 0 && element.classList.contains("toggle-off"))
            element.classList.remove("toggle-off");
        if(["bridgecondition", "gbkcondition"].indexOf(elementid) >= 0)
            display_counts(elementid, progdict[elementid][state]);
        // When tracker is reset state=false is passed
        if(state === false)
            setItemState(elementid, 0);
    }
    else if(element.classList.contains("counter")) {
        element.innerHTML = state;
        // Handle resets
        if(state === false)
            setItemState(elementid, 1);
    }
  }