var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var firstKeyPress = false;

$(document).keypress(function() {
  if (!firstKeyPress) {
    $("#level-title").text("Level " + level);
    nextSequence();
    firstKeyPress = true;
  }
});

$(".btn").click(function() {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}

function playSound(name) {
  new Audio("sounds/" + name + ".mp3").play();
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] == gamePattern[currentLevel]) {
    console.log("Success");
    if(userClickedPattern.length == gamePattern.length) {
        setTimeout(nextSequence, 1000);
    }
  } else {
    console.log("Wrong");
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function(){$("body").removeClass("game-over");}, 200);
    $("#level-title").text("Game Over, Press Any Key to Restart");
    $(document).keypress(function(){startOver();});
    $(document).keypress(function() {
      if (!firstKeyPress) {
        $("#level-title").text("Level " + level);
        nextSequence();
        firstKeyPress = true;
      }
    });
  }
}

function startOver() {
  level = 0;
  gamePattern = [];
  firstKeyPress = false;
}
