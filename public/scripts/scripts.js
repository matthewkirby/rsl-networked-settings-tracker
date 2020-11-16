var progdict = {
    "bridgecondition": ["???", "Open", "Vanilla", "Stones", "Medallions", "Dungeons", "Spiders"],
    "gbkcondition": ["???", "Keysy", "Vanilla", "Ganon's Castle", "Overworld", "Any Dung.", "Keysanity", "LACS: Vanilla", "Stones", "Medallions", "Dungeons", "Spiders", "Triforce"],
    "songs": ["Songs", "V. Songs", "Dung. Songs", "Songsanity"],
    "shops": ["Shops", "Shops 0", "Shops 1", "Shops 2", "Shops 3", "Shops 4", "Shops Rand"],
    "spiders": ["Spiders", "OW Skulls", "Dung. Skulls", "Skullsanity"],
    "scrubs": ["Scrubs", "Cheap Scrubs", "V. Scrubs", "Rand Scrubs"],
    "cows": ["Cows", "No Cows", "Cowsanity"],
    "sks": ["SKs", "SK Keysy", "V. SKs", "Dung. SKs", "OW SKs", "Any Dung. SKs", "SKeysanity"],
    "bks": ["BKs", "BK Keysy", "V. BKs", "Dung. BKs", "OW BKs", "Any Dung. BKs", "BKeysanity"],
    "dot": ["DoT", "Open DoT", "Closed DoT"],
    "pools": ["Item Pool", "Minimal", "Scarce", "Balanced", "Plentiful"],
    "poes": ["Poes", "1 Poe", "2 Poes", "3 Poes", "4 Poes", "5 Poes", "6 Poes", "7 Poes", "8 Poes", "9 Poes", "10 Poes"],
    "hintsreq": ["Hints Req.", "Free Hints", "Unknown Hints", "SoA Hints", "MoT Hints"],
    "dmg": ["Dmg", "Half Dmg", "Normal Dmg", "Double Dmg", "Quad Dmg", "OHKO"]
};

var maxcounts = {
    "Stones": 3,
    "Medallions": 6,
    "Dungeons": 9,
    "Spiders": 100,
    "Triforce": 100
}

function increment_count(elementid, delta) {
    var element = document.getElementById(elementid);
    var currcount = parseInt(element.innerHTML, 10);
    var currcond = (elementid == "bridgecount") 
        ? document.getElementById("bridgecondition").innerHTML 
        : document.getElementById("gbkcondition").innerHTML;
    var newvalue = (currcount+delta > maxcounts[currcond]) ? 1 : currcount+delta;
    rootRef.child("settings").child(elementid).set(newvalue);
}

function decrement_count(elementid, delta) {
    var element = document.getElementById(elementid);
    var currcount = parseInt(element.innerHTML, 10);
    var currcond = (elementid == "bridgecount") 
        ? document.getElementById("bridgecondition").innerHTML 
        : document.getElementById("gbkcondition").innerHTML;
    var newval = (currcount-delta < 1) ? maxcounts[currcond] : currcount-delta;
    rootRef.child("settings").child(elementid).set(newval);
}

function toggle(elementid) {
    var element = document.getElementById(elementid);
    var state = element.classList.contains("toggle-off");
    rootRef.child("settings").child(elementid).set(state);
}

function progressive_forward(elementid) {
    var element = document.getElementById(elementid);
    var idx = progdict[elementid].indexOf(element.innerHTML);
    var newidx = idx+1 >= progdict[elementid].length ? 0 : idx+1;
    rootRef.child("settings").child(elementid).set(newidx);
}

function progressive_reverse(elementid) {
    var element = document.getElementById(elementid);
    var idx = progdict[elementid].indexOf(element.innerHTML);
    var newidx = idx-1 < 0 ? progdict[elementid].length-1 : idx-1;
    rootRef.child("settings").child(elementid).set(newidx);
}

function display_counts(elementid, value) {
    conds_with_counts = ["Stones", "Medallions", "Dungeons", "Spiders", "Triforce"]
    if (elementid == "bridgecondition")
        document.getElementById("bridgecount").style.display = (conds_with_counts.indexOf(value) >= 0) ? "inline" : "none";
    else
        document.getElementById("gbkcount").style.display = (conds_with_counts.indexOf(value) >= 0) ? "inline" : "none";
}