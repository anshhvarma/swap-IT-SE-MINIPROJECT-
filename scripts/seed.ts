const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

const main = async () => {
  try {
    await database.category.createMany({
      data: [
        { name: "Books" },
        { name: "Notebooks" },
        { name: "Textbooks" },
        { name: "Reference Books" },
        { name: "Guides" },
        { name: "Lab Manuals" },
        { name: "Pens" },
        { name: "Pencils" },
        { name: "Erasers" },
        { name: "Sharpeners" },
        { name: "Highlighters" },
        { name: "Markers" },
        { name: "Sticky Notes" },
        { name: "Folders" },
        { name: "Files" },
        { name: "Drawing Sheets" },
        { name: "Graph Sheets" },
        { name: "Chart Papers" },
        { name: "Clipboards" },
        { name: "Geometry Box" },
        { name: "Compass" },
        { name: "Protractor" },
        { name: "Ruler" },
        { name: "Divider" },
        { name: "Roller Scale" },
        { name: "Calculators" },
        { name: "Scientific Calculators" },
        { name: "Pen Drives" },
        { name: "Hard Drives" },
        { name: "USB Cables" },
        { name: "Stationery Sets" },
        { name: "T-Squares" },
        { name: "Set Squares" },
        { name: "Tracing Paper" },
        { name: "Art Supplies" },
        { name: "Paint Brushes" },
        { name: "Color Pencils" },
        { name: "Sketch Pens" },
        { name: "Mechanical Pencils" },
        { name: "Sticky Tabs" },
        { name: "Clip Pins" },
        { name: "Staplers" },
        { name: "Staple Pins" },
        { name: "Punching Machine" },
        { name: "Paper Clips" },
        { name: "Tape Dispenser" },
        { name: "Glue Sticks" },
        { name: "Whiteboard Markers" },
        { name: "Lab Coats" }
      ]
    });
    console.log("Success");
  } catch (error) {
    console.error("Error inserting categories:", error);
  }
};

main();
