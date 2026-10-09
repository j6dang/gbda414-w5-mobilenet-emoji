let currentRecord = null;
let currentEmoji = "❓";
let video;
let classifier;
let currentLabel = "Waiting for classification..."
let currentConfidence = 0;
let modelLoaded = false;
let mappings;

function preload() {
    mappings = loadJSON(
    "finalImageNetLabelsAndEmojis.json",
    () => console.log("JSON loaded successfully!"),
    (error) => console.error("JSON failed to load:", error)
  );
}

function normalizeLabel(label) {
  return String(label).toLowerCase().trim().split(",")[0].trim();
}

function findMatchingRecord(label) {
  const records = Array.isArray(mappings)
    ? mappings
    : Object.values(mappings || {});

  return records.find(record =>
    normalizeLabel(record.label) === normalizeLabel(label)
  ) || null;
}

function setup() {
createCanvas(960,720)
video = createCapture(VIDEO, {flipped:true});
video.size(width, height);
video.hide();

classifier = ml5.imageClassifier("MobileNet", {flipped:true})
modelLoaded = true; 
classifier.classifyStart(video, gotResults);

}

function gotResults(results) {
  if (!results || results.length === 0) return;

  currentLabel = results[0].label;
  currentConfidence = results[0].confidence;

  currentRecord = findMatchingRecord(currentLabel);
  currentEmoji = currentRecord?.emoji || "❓";
}

function draw() {
image(video, 0,0, width, height);
fill(0, 160);
noStroke();
rect(20, 20, 760, 200, 12);
fill(255);
textAlign(LEFT, TOP);
textSize(18);
text("STEP 2: MOBILENET CLASSIFICATION", 40, 42);
if (!modelLoaded) {
    textSize(24);
    text("loading Mobilenet...", 40, 82);
    return;
}

textSize(18);
text("MobileNet label:", 40, 82);
textSize(28); 
text(currentLabel, 40, 115, 680, 45);

textSize(18);
text("confidence: " + currentConfidence, 40, 175);

let emojiSize = map(currentConfidence, 0, 1, 40, 150);

textAlign(CENTER, CENTER);
textSize(emojiSize);
text(currentEmoji, width / 2, 450);

textSize(20);
text(
  "Category: " + (currentRecord?.workshopCategory || "Unknown"),
  width / 2,
  570
);

}
