import { getUid } from "@/utils";
import { makeAutoObservable } from "mobx";

class Store {
  canvas;
  editorElements;
  backgroundColor;
  maxTime;
  playing;
  currentKeyFrame;
  selectedElement;
  fps;
  selectedMenuOption;
  imageResources;
  shapes;
  constructor() {
    this.canvas = null;
    this.editorElements = [];
    this.imageResources = [];
    this.shapes = [];
    this.backgroundColor = "rgba(0, 0, 0, 0)";
    this.maxTime = 30 * 1000;
    this.playing = false;
    this.currentKeyFrame = 0;
    this.selectedElement = null;
    this.fps = 60;
    this.selectedMenuOption = "Text";
    makeAutoObservable(this);
  }
  renderCheckeredBackground(canvas) {
    const ctx = canvas.getContext("2d");
    const gridSize = 10; // Adjust the size of the grid squares as needed
    const numGridX = canvas.width / gridSize;
    const numGridY = canvas.height / gridSize;
    console.log("renderCheckeredBackground", ctx);
    for (let i = 0; i < numGridX; i++) {
      for (let j = 0; j < numGridY; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillStyle = "rgba(200, 200, 200, 0.5)"; // Light gray for checkered pattern
        } else {
          ctx.fillStyle = "rgba(100, 100, 100, 0.5)"; // Dark gray for checkered pattern
        }

        ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
      }
    }
  }
  addImageResource(url) {
    this.imageResources = [...this.imageResources, url];
  }
  removeEditorElement(id) {
    const newElements = this.editorElements.filter((el) => el.id != id);
    this.setEditorElements(newElements);
  }
  async removeBG(index) {
    const imageElement = document.getElementById(`image-${index}`);
    if (imageElement.tagName !== "IMG") {
      return;
    }
    const imageUrl = imageElement.src;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const fileName = `image-${index}.jpg`; // You can customize the filename as needed
    const imageFile = new File([blob], fileName, { type: blob.type });
    // const imageFile = imageElement.files[0];
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      try {
        const res = await fetch(
          "https://king-prawn-app-c2zml.ondigitalocean.app/remback",
          { method: "POST", body: formData }
        ).then((res) => res.json());
        // console.log(res.body.background_removed);

        this.addImageResource(
          `data:image/png;base64,${res.background_removed}`
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
  addShape(src, index) {
    const shape = document.getElementById(`shape-image-${index}`);
    const aspectRatio = shape.naturalWidth / shape.naturalHeight;
    console.log(aspectRatio);
    const id = getUid();
    this.addEditorElement({
      type: "shape",
      name: `Media(shape) ${index}`,
      id: id,
      placement: {
        x: 0,
        y: 0,
        width: 100 * aspectRatio,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      timeFrame: {
        start: 0,
        end: this.maxTime,
      },
      properties: {
        elementId: `shape-${id}`,
        src: src,
      },
    });
  }
  addImage(index) {
    const imageElement = document.getElementById(`image-${index}`);
    if (imageElement.tagName !== "IMG") {
      return;
    }
    const aspectRatio = imageElement.naturalWidth / imageElement.naturalHeight;
    const id = getUid();
    console.log("UID", id);
    // this.imageResources[index]
    // const id=
    this.addEditorElement({
      type: "image",
      name: `Media(image) ${index + 1}`,
      id: id,
      placement: {
        x: 0,
        y: 0,
        width: 100 * aspectRatio,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      timeFrame: {
        start: 0,
        end: this.maxTime,
      },
      properties: {
        elementId: `image-${id}`,
        src: imageElement.src,
        effect: {
          type: "none",
        },
      },
    });
  }
  setCanvas(canvas) {
    this.canvas = canvas;
    this.initAlgnGlines(canvas);
    this.initCntrGlines(canvas);
    this.renderCheckeredBackground(canvas);
    if (canvas) {
      canvas.backgroundColor = this.backgroundColor;
    }
  }
  updateSelectedElement() {
    this.selectedElement =
      this.editorElements.find(
        (element) => element.id === this.selectedElement?.id
      ) ?? null;
  }
  setEditorElements(editorElements) {
    this.editorElements = editorElements;
    this.updateSelectedElement();
    this.refreshElements();
  }
  addEditorElement(editorElement) {
    console.log("editorElement", editorElement);
    this.setEditorElements([...this.editorElements, editorElement]);
    this.refreshElements();

    this.setSelectedElement(
      this.editorElements[this.editorElements.length - 1]
    );
  }
  setSelectedElement(selectedElement) {
    this.selectedElement = selectedElement;
    if (this.canvas) {
      if (selectedElement?.fabricObject)
        this.canvas.setActiveObject(selectedElement.fabricObject);
      else this.canvas.discardActiveObject();
    }
  }
  initAlgnGlines(canvas) {
    var ctx = canvas.getSelectionContext(),
      aligningLineOffset = 5,
      aligningLineMargin = 4,
      aligningLineWidth = 1,
      aligningLineColor = "#31AEFB",
      viewportTransform;

    // // // console.log(ctx);

    function drawVerticalLine(coords) {
      drawLine(
        coords.x + 0.5,
        coords.y1 > coords.y2 ? coords.y2 : coords.y1,
        coords.x + 0.5,
        coords.y2 > coords.y1 ? coords.y2 : coords.y1
      );
    }

    function drawHorizontalLine(coords) {
      drawLine(
        coords.x1 > coords.x2 ? coords.x2 : coords.x1,
        coords.y + 0.5,
        coords.x2 > coords.x1 ? coords.x2 : coords.x1,
        coords.y + 0.5
      );
    }

    function drawLine(x1, y1, x2, y2) {
      ctx.save();
      ctx.lineWidth = aligningLineWidth;
      ctx.strokeStyle = aligningLineColor;
      ctx.beginPath();
      ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3]);
      ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3]);
      ctx.stroke();
      ctx.restore();
    }

    function isInRange(value1, value2) {
      value1 = Math.round(value1);
      value2 = Math.round(value2);
      for (
        var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin;
        i <= len;
        i++
      ) {
        if (i === value2) {
          return true;
        }
      }
      return false;
    }

    var verticalLines = [],
      horizontalLines = [];

    canvas.on("mouse:down", function () {
      viewportTransform = canvas.viewportTransform;
    });

    canvas.on("object:moving", function (e) {
      var activeObject = e.target,
        canvasObjects = canvas.getObjects(),
        activeObjectCenter = activeObject.getCenterPoint(),
        activeObjectLeft = activeObjectCenter.x,
        activeObjectTop = activeObjectCenter.y,
        activeObjectHeight =
          activeObject.getBoundingRect().height / viewportTransform[3],
        activeObjectWidth =
          activeObject.getBoundingRect().width / viewportTransform[0],
        horizontalInTheRange = false,
        verticalInTheRange = false,
        transform = canvas._currentTransform;

      if (!transform) return;

      // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
      // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

      for (var i = canvasObjects.length; i--; ) {
        if (canvasObjects[i] === activeObject) continue;

        var objectCenter = canvasObjects[i].getCenterPoint(),
          objectLeft = objectCenter.x,
          objectTop = objectCenter.y,
          objectHeight =
            canvasObjects[i].getBoundingRect().height / viewportTransform[3],
          objectWidth =
            canvasObjects[i].getBoundingRect().width / viewportTransform[0];

        // snap by the horizontal center line
        if (isInRange(objectLeft, activeObjectLeft)) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(objectLeft, activeObjectTop),
            "center",
            "center"
          );
        }

        // snap by the left edge
        if (
          isInRange(
            objectLeft - objectWidth / 2,
            activeObjectLeft - activeObjectWidth / 2
          )
        ) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft - objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(
              objectLeft - objectWidth / 2 + activeObjectWidth / 2,
              activeObjectTop
            ),
            "center",
            "center"
          );
        }

        // snap by the right edge
        if (
          isInRange(
            objectLeft + objectWidth / 2,
            activeObjectLeft + activeObjectWidth / 2
          )
        ) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft + objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(
              objectLeft + objectWidth / 2 - activeObjectWidth / 2,
              activeObjectTop
            ),
            "center",
            "center"
          );
        }

        // snap by the vertical center line
        if (isInRange(objectTop, activeObjectTop)) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(activeObjectLeft, objectTop),
            "center",
            "center"
          );
        }

        // snap by the top edge
        if (
          isInRange(
            objectTop - objectHeight / 2,
            activeObjectTop - activeObjectHeight / 2
          )
        ) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop - objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(
              activeObjectLeft,
              objectTop - objectHeight / 2 + activeObjectHeight / 2
            ),
            "center",
            "center"
          );
        }

        // snap by the bottom edge
        if (
          isInRange(
            objectTop + objectHeight / 2,
            activeObjectTop + activeObjectHeight / 2
          )
        ) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop + objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(
              activeObjectLeft,
              objectTop + objectHeight / 2 - activeObjectHeight / 2
            ),
            "center",
            "center"
          );
        }
      }

      if (!horizontalInTheRange) {
        horizontalLines.length = 0;
      }

      if (!verticalInTheRange) {
        verticalLines.length = 0;
      }
    });

    canvas.on("before:render", function () {
      const ct = canvas.contextTop;
      if (ct) canvas.clearContext(ct);
    });

    canvas.on("after:render", function () {
      for (var i = verticalLines.length; i--; ) {
        drawVerticalLine(verticalLines[i]);
      }
      for (var i = horizontalLines.length; i--; ) {
        drawHorizontalLine(horizontalLines[i]);
      }

      verticalLines.length = horizontalLines.length = 0;
    });

    canvas.on("mouse:up", function () {
      verticalLines.length = horizontalLines.length = 0;
      // canvas.renderAll();
    });
  }
  initCntrGlines(canvas) {
    var canvasWidth = canvas.getWidth(),
      canvasHeight = canvas.getHeight(),
      canvasWidthCenter = canvasWidth / 2,
      canvasHeightCenter = canvasHeight / 2,
      canvasWidthCenterMap = {},
      canvasHeightCenterMap = {},
      centerLineMargin = 4,
      centerLineColor = "rgba(250,200,255,0.5)",
      centerLineWidth = 1,
      ctx = canvas.getSelectionContext(),
      viewportTransform;

    for (
      var i = canvasWidthCenter - centerLineMargin,
        len = canvasWidthCenter + centerLineMargin;
      i <= len;
      i++
    ) {
      canvasWidthCenterMap[Math.round(i)] = true;
    }
    for (
      var i = canvasHeightCenter - centerLineMargin,
        len = canvasHeightCenter + centerLineMargin;
      i <= len;
      i++
    ) {
      canvasHeightCenterMap[Math.round(i)] = true;
    }

    function showVerticalCenterLine() {
      showCenterLine(
        canvasWidthCenter + 0.5,
        0,
        canvasWidthCenter + 0.5,
        canvasHeight
      );
    }

    function showHorizontalCenterLine() {
      showCenterLine(
        0,
        canvasHeightCenter + 0.5,
        canvasWidth,
        canvasHeightCenter + 0.5
      );
    }

    function showCenterLine(x1, y1, x2, y2) {
      ctx.save();
      ctx.strokeStyle = centerLineColor;
      ctx.lineWidth = centerLineWidth;
      ctx.beginPath();
      ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3]);
      ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3]);
      ctx.stroke();
      ctx.restore();
    }

    var afterRenderActions = [],
      isInVerticalCenter,
      isInHorizontalCenter;

    canvas.on("mouse:down", function () {
      viewportTransform = canvas.viewportTransform;
    });

    canvas.on("object:moving", function (e) {
      var object = e.target,
        objectCenter = object.getCenterPoint(),
        transform = canvas._currentTransform;

      if (!transform) return;

      (isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap),
        (isInHorizontalCenter =
          Math.round(objectCenter.y) in canvasHeightCenterMap);

      if (isInHorizontalCenter || isInVerticalCenter) {
        object.setPositionByOrigin(
          new fabric.Point(
            isInVerticalCenter ? canvasWidthCenter : objectCenter.x,
            isInHorizontalCenter ? canvasHeightCenter : objectCenter.y
          ),
          "center",
          "center"
        );
      }
    });

    canvas.on("before:render", function () {
      const ct = canvas.contextTop;
      if (ct) canvas.clearContext(ct);
    });

    canvas.on("after:render", function () {
      if (isInVerticalCenter) {
        showVerticalCenterLine();
      }
      if (isInHorizontalCenter) {
        showHorizontalCenterLine();
      }
    });

    canvas.on("mouse:up", function () {
      // clear these values, to stop drawing guidelines once mouse is up
      isInVerticalCenter = isInHorizontalCenter = null;
      // canvas.renderAll();
    });
  }
  refreshElements() {
    const store = this;
    if (!store.canvas) return;
    const canvas = store.canvas;
    store.canvas.remove(...store.canvas.getObjects());
    for (let index = 0; index < store.editorElements.length; index++) {
      const element = store.editorElements[index];

      switch (element.type) {
        case "text":
          const textObject = new fabric.Textbox(element.properties.text, {
            name: element.id,
            left: element.placement.x,
            top: element.placement.y,
            scaleX: element.placement.scaleX,
            scaleY: element.placement.scaleY,
            width: element.placement.width,
            height: element.placement.height,
            angle: element.placement.rotation,
            fontSize: element.properties.fontSize,
            fontWeight: element.properties.fontWeight,
            fontFamily: element.properties.fontFamily,
            objectCaching: false,
            selectable: true,
            lockUniScaling: true,
            fill: "#ffffff",
          });
          element.fabricObject = textObject;
          canvas.add(textObject);
          canvas.on("object:modified", (e) => {
            if (!e.target) return;
            const target = e.target;
            if (target != textObject) return;
            const placement = element.placement;
            const newPlacement = {
              ...placement,
              x: target.left ?? placement.x,
              y: target.top ?? placement.y,
              rotation: target.angle ?? placement.rotation,
              width: target.width ?? placement.width,
              height: target.height ?? placement.height,
              scaleX: target.scaleX ?? placement.scaleX,
              scaleY: target.scaleY ?? placement.scaleY,
            };
            const newElement = {
              ...element,
              placement: newPlacement,
              properties: {
                ...element.properties,
                text: target?.text,
              },
            };
            store.updateEditorElement(newElement);
          });
          break;
        case "image":
          const imageElement = document.getElementById(
            element.properties.elementId
          );
          if (!imageElement) continue;
          if (imageElement?.tagName !== "IMG") continue;
          const imageObject = new fabric.Image(imageElement, {
            name: element.id,
            left: element.placement.x,
            top: element.placement.y,
            angle: element.placement.rotation,
            objectCaching: false,
            selectable: true,
            lockUniScaling: true,
          });
          const imageDimensions = {
            w: imageElement.naturalWidth,
            h: imageElement.naturalHeight,
          };
          imageObject.width = imageDimensions.w;
          imageObject.height = imageDimensions.h;
          imageElement.width = imageDimensions.w;
          imageElement.height = imageDimensions.h;
          imageObject.scaleToHeight(imageDimensions.w);
          imageObject.scaleToWidth(imageDimensions.h);
          const toScale = {
            x: element.placement.width / imageDimensions.w,
            y: element.placement.height / imageDimensions.h,
          };
          imageObject.scaleX = toScale.x * element.placement.scaleX;
          imageObject.scaleY = toScale.y * element.placement.scaleY;
          this.canvas.add(imageObject);
          canvas.on("object:modified", function (e) {
            if (!e.target) return;
            const target = e.target;
            if (target != imageObject) return;
            const placement = element.placement;
            let finalScale = 1;
            if (target.scaleX && target.scaleX > 0) {
              finalScale = target.scaleX / toScale.x;
            }
            const newPlacement = {
              ...placement,
              x: target.left ?? placement.x,
              y: target.top ?? placement.y,
              rotation: target.angle ?? placement.rotation,
              scaleX: finalScale,
              scaleY: finalScale,
            };
            const newElement = {
              ...element,
              placement: newPlacement,
            };
            store.updateEditorElement(newElement);
          });
          break;
        case "shape":
          if (element.properties.src.slice(-3) === "svg") {
            let oSVG;
            fabric.loadSVGFromURL(
              element.properties.src,
              (objects, options) => {
                oSVG = fabric.util.groupSVGElements(objects, options);
                oSVG.set({
                  name: element.id,
                  left: element.placement.x,
                  top: element.placement.y,
                  angle: element.placement.rotation,
                  objectCaching: false,
                  selectable: true,
                  lockUniScaling: true,
                });
                const imageElement = document.getElementById(
                  element.properties.elementId
                );
                if (imageElement == null) return;
                const imageDimensions = {
                  w: imageElement.viewBox.baseVal.width ?? 100,
                  h: imageElement.viewBox.baseVal.height ?? 100,
                };
                oSVG.width = imageDimensions.w;
                oSVG.height = imageDimensions.h;
                imageElement.setAttribute("width", imageDimensions.w);
                imageElement.setAttribute("height", imageDimensions.h);
                oSVG.scaleToHeight(imageDimensions.w);
                oSVG.scaleToWidth(imageDimensions.h);
                const toScale = {
                  x: element.placement.width / imageDimensions.w,
                  y: element.placement.height / imageDimensions.h,
                };
                oSVG.scaleX = toScale.x * element.placement.scaleX;
                oSVG.scaleY = toScale.y * element.placement.scaleY;
                this.canvas.add(oSVG);

                canvas.on("object:modified", function (e) {
                  if (!e.target) return;
                  const target = e.target;
                  // console.log(target, oSVG);
                  if (target != oSVG) return;
                  const placement = element.placement;
                  let finalScale = 1;
                  if (target.scaleX && target.scaleX > 0) {
                    finalScale = target.scaleX / toScale.x;
                  }
                  const newPlacement = {
                    ...placement,
                    x: target.left ?? placement.x,
                    y: target.top ?? placement.y,
                    rotation: target.angle ?? placement.rotation,
                    scaleX: finalScale,
                    scaleY: finalScale,
                  };
                  const newElement = {
                    ...element,
                    placement: newPlacement,
                  };
                  store.updateEditorElement(newElement);
                });
              }
            );
          } else {
            const imageElement = document.getElementById(
              element.properties.elementId
            );
            if (!imageElement) continue;
            if (imageElement?.tagName !== "IMG") continue;
            const imageObject = new fabric.Image(imageElement, {
              name: element.id,
              left: element.placement.x,
              top: element.placement.y,
              angle: element.placement.rotation,
              objectCaching: false,
              selectable: true,
              lockUniScaling: true,
            });
            const imageDimensions = {
              w: imageElement.naturalWidth,
              h: imageElement.naturalHeight,
            };
            imageObject.width = imageDimensions.w;
            imageObject.height = imageDimensions.h;
            imageElement.width = imageDimensions.w;
            imageElement.height = imageDimensions.h;
            imageObject.scaleToHeight(imageDimensions.w);
            imageObject.scaleToWidth(imageDimensions.h);
            const toScale = {
              x: element.placement.width / imageDimensions.w,
              y: element.placement.height / imageDimensions.h,
            };
            imageObject.scaleX = toScale.x * element.placement.scaleX;
            imageObject.scaleY = toScale.y * element.placement.scaleY;
            this.canvas.add(imageObject);
            canvas.on("object:modified", function (e) {
              if (!e.target) return;
              const target = e.target;
              if (target != imageObject) return;
              const placement = element.placement;
              let finalScale = 1;
              if (target.scaleX && target.scaleX > 0) {
                finalScale = target.scaleX / toScale.x;
              }
              const newPlacement = {
                ...placement,
                x: target.left ?? placement.x,
                y: target.top ?? placement.y,
                rotation: target.angle ?? placement.rotation,
                scaleX: finalScale,
                scaleY: finalScale,
              };
              const newElement = {
                ...element,
                placement: newPlacement,
              };
              store.updateEditorElement(newElement);
            });
          }

          break;
        default: {
          throw new Error("Not implemented");
        }
      }
      if (element.fabricObject) {
        element.fabricObject.on("selected", function (e) {
          store.setSelectedElement(element);
        });
      }
    }
    const selectedEditorElement = store.selectedElement;
    if (selectedEditorElement && selectedEditorElement.fabricObject) {
      canvas.setActiveObject(selectedEditorElement.fabricObject);
    }
    store.canvas.renderAll();
  }
  updateEditorElement(editorElement) {
    this.setEditorElements(
      this.editorElements.map((element) =>
        element.id === editorElement.id ? editorElement : element
      )
    );
  }

  addText({ text, fontSize, fontWeight, fontFamily }) {
    const id = getUid();
    const index = this.editorElements.length;
    this.addEditorElement({
      id,
      name: `Text id`,
      type: "text",
      placement: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      timeFrame: {
        start: 0,
        end: this.maxTime,
      },
      properties: {
        text: text,
        fontSize: fontSize,
        fontWeight: fontWeight,
        fontFamily: fontFamily,
        splittedTexts: [],
      },
    });
  }
}

export default Store;
