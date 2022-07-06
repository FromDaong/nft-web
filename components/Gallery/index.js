import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import Atropos from "atropos/react";

const totmArr = [
  {
    image: "/assets/cherieCover.jpg",
    href: "https://issuu.com/treatdao/docs/totm_6_cherie_noel?fr=sOWIxODQ2MTQ0MjQ",
  },
  {
    image: "/assets/stormyCover.jpg",
    href: "https://issuu.com/treatdao/docs/totm_5_stormy_daniels?fr=sMTc0YTQ2MTQ0MjQ",
  },
  {
    image: "/assets/elizaCover.jpg",
    href: "https://issuu.com/treatdao/docs/totm_4_eliza_rose?fr=sNDIzZDQ2MTQ0MjQ",
  },
  {
    image: "/assets/marenCover.jpg",
    href: "https://issuu.com/treatdao/docs/totm_3_maren?fr=sMTgxZjQ2MTQ0MjQ",
  },
  {
    image: "/assets/KristinCover.png",
    href: "https://issuu.com/treatdao/docs/totm_2_kristin_elise?fr=sNTUyZTQ2MTQ0MjQ",
  },
  {
    image: "/assets/OnaCover.png",
    href: "https://issuu.com/treatdao/docs/treatmagazine1.pptx?fr=sYWE5MTQ1Mzk2OTc",
  },
];

const Gallery = () => {
  return (
    <Row xs={1} md={3} className="g-4 pink-bg">
      {totmArr.map((totm) => (
        <Col className="mb-3">
          <a href={totm.href} target="_blank" rel="noreferrer">
            <Atropos className="my-atropos">
              <Card.Img className="p-2" variant="top" src={totm.image} />
            </Atropos>
          </a>
        </Col>
      ))}
    </Row>
  );
};

export default Gallery;
