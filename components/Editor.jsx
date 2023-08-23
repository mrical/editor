"use client";
import { StoreContext } from "@/store";
import { fabric } from "fabric";
import React, { useContext, useEffect } from "react";
import Menu from "./Menu";
import { observer } from "mobx-react";
import Resources from "./Resources";
import ElementsPanel from "./panels/ElementsPanel";

const Editor = () => {
  const store = useContext(StoreContext);
  useEffect(() => {
    //pattern canvas
    const canvasSize = 400; // Adjust as needed
    const canvasWidth = 270;
    const canvasHeight = 480;

    const canvas = new fabric.Canvas("canvas", {
      width: canvasWidth,
      height: canvasHeight,
      // backgroundColor: "#ededed",
      backgroundColor: "rgba(0, 0, 0, 0)",
    });
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#00a0f5";
    fabric.Object.prototype.cornerStyle = "circle";
    fabric.Object.prototype.cornerStrokeColor = "#0063d8";
    fabric.Object.prototype.cornerSize = 10;
    canvas.on("mouse:down", function (e) {
      if (!e.target) {
        store.setSelectedElement(null);
      }
    });
    store.setCanvas(canvas);
    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
  }, []);
  return (
    <div className="grid grid-rows-[20px_500px_1fr] grid-cols-[60px_200px_800px_1fr] h-[100%]">
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:400,500,700|Roboto+Condensed:400,700|Lato:300,400,900|Oswald:300,500,700|Raleway:400,700|Montserrat:800|Archivo+Black|Bellefair|Bungee|Cabin+Sketch:700|Caveat|Chewy|Handlee|Poiret+One|Russo+One|Abel|Acme|Alegreya+Sans|Amatic+SC|Anton|Arimo|Arvo|Asap|Athiti|Bowlby+One|Bree+Serif|Bubbler+One|Cabin|Cinzel|Cuprum|Dancing+Script|Dosis|Droid+Serif|EB+Garamond|Exo|Exo+2|Fira+Sans|Frijole|Gloria+Hallelujah|Inconsolata|Indie+Flower|Josefin+Sans|Josefin+Slab|Lobster|Maven+Pro|Muli|News+Cycle|Nunito|Open+Sans|Open+Sans+Condensed:300|Orbitron|Overpass|Oxygen|PT+Sans|PT+Sans+Caption|Pacifico|Pangolin|Pathway+Gothic+One|Patrick+Hand+SC|Patua+One|Permanent+Marker|Play|Playfair+Display|Quicksand|Raleway|Roboto+Mono|Satisfy|Shadows+Into+Light|Signika|Slabo+27px|Spectral|Ubuntu|Yanone+Kaffeesatz|Yellowtail"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Abril+Fatface&amp;family=Alfa+Slab+One&amp;family=Allan&amp;family=Atomic+Age&amp;family=Audiowide&amp;family=Bangers&amp;family=Baumans&amp;family=Bebas+Neue&amp;family=Black+Ops+One&amp;family=Boogaloo&amp;family=Bungee&amp;family=Bungee+Shade&amp;family=Butcherman&amp;family=Cabin+Sketch&amp;family=Caesar+Dressing&amp;family=Carter+One&amp;family=Ceviche+One&amp;family=Chewy&amp;family=Cinzel+Decorative&amp;family=Coda&amp;family=Coiny&amp;family=Comfortaa&amp;family=Concert+One&amp;family=Emilys+Candy&amp;family=Faster+One&amp;family=Finger+Paint&amp;family=Fredericka+the+Great&amp;family=Fredoka+One&amp;family=Fugaz+One&amp;family=Galada&amp;family=Gugi&amp;family=Jolly+Lodger&amp;family=Katibeh&amp;family=Kelly+Slab&amp;family=Knewave&amp;family=Lemonada&amp;family=Limelight&amp;family=Lobster&amp;family=Londrina+Solid&amp;family=Love+Ya+Like+A+Sister&amp;family=Luckiest+Guy&amp;family=Megrim&amp;family=Metamorphous&amp;family=Miniver&amp;family=Modak&amp;family=Monoton&amp;family=Mountains+of+Christmas&amp;family=Nosifer&amp;family=Nova+Script&amp;family=Oldenburg&amp;family=Oleo+Script&amp;family=Oleo+Script+Swash+Caps&amp;family=Overlock&amp;family=Passion+One&amp;family=Patua+One&amp;family=Playball&amp;family=Poiret+One&amp;family=Pompiere&amp;family=Press+Start+2P&amp;family=Raleway+Dots&amp;family=Righteous&amp;family=Rye&amp;family=Sevillana&amp;family=Shrikhand&amp;family=Sigmar+One&amp;family=Special+Elite&amp;family=Squada+One&amp;family=Staatliches&amp;family=Unica+One&amp;family=UnifrakturMaguntia&amp;family=Unlock&amp;family=Vampiro+One&amp;family=Yeseva+One&amp;family=Aladin&amp;family=Amita&amp;family=Arizonia&amp;family=Berkshire+Swash&amp;family=Bonbon&amp;family=Butterfly+Kids&amp;family=Calligraffitti&amp;family=Caveat&amp;family=Caveat+Brush&amp;family=Cedarville+Cursive&amp;family=Courgette&amp;family=Dancing+Script&amp;family=East+Sea+Dokdo&amp;family=Grand+Hotel&amp;family=Great+Vibes&amp;family=Herr+Von+Muellerhoff&amp;family=Homemade+Apple&amp;family=Indie+Flower&amp;family=Kalam&amp;family=Marck+Script&amp;family=Meddon&amp;family=Merienda+One&amp;family=Montez&amp;family=Mr+De+Haviland&amp;family=Pacifico&amp;family=Patrick+Hand&amp;family=Rochester&amp;family=Rouge+Script&amp;family=Sacramento&amp;family=Satisfy&amp;family=Shadows+Into+Light&amp;family=Shadows+Into+Light+Two&amp;family=Stalemate&amp;family=Tangerine&amp;display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Aclonica&amp;family=Acme&amp;family=Amaranth&amp;family=Anton&amp;family=Archivo+Black&amp;family=Arimo&amp;family=BenchNine&amp;family=Black+And+White+Picture&amp;family=Cabin&amp;family=Cairo&amp;family=Changa&amp;family=Denk+One&amp;family=Dosis&amp;family=Economica&amp;family=El+Messiri&amp;family=Exo&amp;family=Exo+2&amp;family=Fira+Sans&amp;family=Fjalla+One&amp;family=Francois+One&amp;family=Heebo&amp;family=Hind+Vadodara&amp;family=Inter&amp;family=Josefin+Sans&amp;family=Jost&amp;family=Jua&amp;family=Julius+Sans+One&amp;family=KoHo&amp;family=Lato&amp;family=Marmelad&amp;family=Maven+Pro&amp;family=Merriweather+Sans&amp;family=Monda&amp;family=Montserrat&amp;family=Montserrat+Alternates&amp;family=Mouse+Memoirs&amp;family=Mukta&amp;family=Muli&amp;family=Notable&amp;family=Noto+Sans+JP&amp;family=Nunito&amp;family=Nunito+Sans&amp;family=Open+Sans&amp;family=Orbitron&amp;family=Oswald&amp;family=Oxygen&amp;family=Pathway+Gothic+One&amp;family=Pattaya&amp;family=Philosopher&amp;family=Play&amp;family=Poppins&amp;family=Prompt&amp;family=Quattrocento+Sans&amp;family=Quicksand&amp;family=Raleway&amp;family=Rationale&amp;family=Reem+Kufi&amp;family=Roboto&amp;family=Roboto+Condensed&amp;family=Rubik&amp;family=Ruluko&amp;family=Rum+Raisin&amp;family=Russo+One&amp;family=Sansita&amp;family=Sarabun&amp;family=Sawarabi+Mincho&amp;family=Seymour+One&amp;family=Source+Sans+Pro&amp;family=Teko&amp;family=Timmana&amp;family=Titillium+Web&amp;family=Tomorrow&amp;family=Varela+Round&amp;family=Viga&amp;family=Voltaire&amp;family=Wendy+One&amp;family=Wire+One&amp;family=Work+Sans&amp;display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Alegreya&amp;family=Alegreya+SC&amp;family=Almendra&amp;family=Arvo&amp;family=BioRhyme&amp;family=Bitter&amp;family=Cormorant&amp;family=Cormorant+Garamond&amp;family=Cormorant+Infant&amp;family=Cormorant+SC&amp;family=Cormorant+Unicase&amp;family=Cormorant+Upright&amp;family=Crimson+Text&amp;family=DM+Serif+Text&amp;family=David+Libre&amp;family=Enriqueta&amp;family=Frank+Ruhl+Libre&amp;family=Gelasio&amp;family=Grenze&amp;family=IBM+Plex+Serif&amp;family=Ibarra+Real+Nova&amp;family=Inknut+Antiqua&amp;family=Inria+Serif&amp;family=Karma&amp;family=Laila&amp;family=Libre+Baskerville&amp;family=Lora&amp;family=Maitree&amp;family=Martel&amp;family=Merriweather&amp;family=Neuton&amp;family=Noto+Serif&amp;family=Noto+Serif+KR&amp;family=PT+Serif&amp;family=Playfair+Display&amp;family=Pridi&amp;family=Roboto+Slab&amp;family=Spectral&amp;family=Spectral+SC&amp;family=Taviraj&amp;family=Trirong&amp;family=Vesper+Libre&amp;family=Volkhov&amp;family=Vollkorn:ital@1&amp;display=swap"
        rel="stylesheet"
      />
      <div className="tile row-span-2 flex flex-col">
        <Menu />
      </div>
      <div className="row-span-2 flex flex-col overflow-auto">
        <Resources />
      </div>
      <div className="flex-auto flex align-middle justify-center canvas-container">
        <canvas id="canvas" className="h-[480px] w-[270px] row col-start-3" />
      </div>
      <div className="col-start-4 row-start-2">
        <ElementsPanel />
      </div>
    </div>
  );
};

export default observer(Editor);
