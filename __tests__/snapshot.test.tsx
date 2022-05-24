import Index from "../pages/index";
import renderer from "react-test-renderer";

it("renders homepage unchanged", () => {
  const tree = renderer.create(<Index modelD={undefined} />).toJSON();
  expect(tree).toMatchSnapshot();
});
