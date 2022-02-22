import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Link from "next/link";

const Gallery = () => {
  return (
    <Row xs={1} md={3} className="g-4">
      {Array.from({ length: 1 }).map((_, idx) => (
        <Col>
          <Card className="p-2">
            <a
              href="https://issuu.com/treatdao/docs/treatmagazine1.pptx?fr=sYWE5MTQ1Mzk2OTc"
              target="_blank" rel="noreferrer"
            >
              <Card.Img
                className="p-2"
                variant="top"
                src={"/assets/OnaCover.png"}
              />
            </a>
            <Card.Body>
              <Card.Title>Feburary: Ona Artist</Card.Title>
              <Card.Text>
                Curated collection featuring Ona Artist GFE-NFT
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}

      {Array.from({ length: 1 }).map((_, idx) => (
        <Col>
          <Card>
            <Card.Img
              className="p-2"
              variant="top"
              src={"/assets/suneTotm.png"}
            />
            <Card.Body>
              <Card.Title>March Edition</Card.Title>
              <Card.Text>Coming Soon</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}

      {Array.from({ length: 1 }).map((_, idx) => (
        <Col>
          <Card>
            <Card.Img
              className="p-2"
              variant="top"
              src={"/assets/suneTotm.png"}
            />
            <Card.Body>
              <Card.Title>April Edition</Card.Title>
              <Card.Text>Coming Soon</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Gallery;
