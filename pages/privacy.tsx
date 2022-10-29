import { SEOHead } from "@packages/seo/page";

export default function Privacy() {
  return (
    <>
      <SEOHead title={"Treat Privacy Policy"} />
      <div className="max-w-4xl p-4 mx-auto lg:p-0">
        <div className="flex flex-col max-w-xl gap-4 py-16 mx-auto text-center">
          <p className="text-purple-500">
            As of {new Date().toLocaleDateString()}
          </p>
          <h1 className="text-5xl font-medium text-slate-900">
            We care about your privacy
          </h1>
          <p>
            Your privacy is important to us at Treat. We respect your privacy
            regarding any information we may collect from you across our
            website.
          </p>
        </div>
      </div>
      <div className="flex flex-col max-w-3xl gap-16 py-12 mx-auto">
        <p>
          Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
          suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis
          montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere
          vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien
          varius id. Eget quis mi enim, leo lacinia pharetra, semper. Eget in
          volutpat mollis at volutpat lectus velit, sed auctor. Porttitor fames
          arcu quis fusce augue enim. Quis at habitant diam at. Suscipit
          tristique risus, at donec. In turpis vel et quam imperdiet. Ipsum
          molestie aliquet sodales id est ac volutpat.{" "}
        </p>
        <div>
          <h3 className="mb-2 text-3xl font-medium text-gray-900">
            What information do we collect?
          </h3>
          <p>
            Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla
            odio nisl vitae. In aliquet pellentesque aenean hac vestibulum
            turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada
            fringilla. Elit nisi in eleifend sed nisi. Pulvinar at orci, proin
            imperdiet commodo consectetur convallis risus. Sed condimentum enim
            dignissim adipiscing faucibus consequat, urna. Viverra purus et erat
            auctor aliquam. Risus, volutpat vulputate posuere purus sit congue
            convallis aliquet. Arcu id augue ut feugiat donec porttitor neque.
            Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor
            lacus, eget nunc lectus in tellus, pharetra, porttitor. Ipsum sit
            mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non
            pellentesque congue eget consectetur turpis. Sapien, dictum molestie
            sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit
            eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh
            orci.
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-3xl font-medium text-gray-900">
            How do we use your information?
          </h3>
          <p>
            Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla
            odio nisl vitae. In aliquet pellentesque aenean hac vestibulum
            turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada
            fringilla. Elit nisi in eleifend sed nisi. Pulvinar at orci, proin
            imperdiet commodo consectetur convallis risus. Sed condimentum enim
            dignissim adipiscing faucibus consequat, urna. Viverra purus et erat
            auctor aliquam. Risus, volutpat vulputate posuere purus sit congue
            convallis aliquet. Arcu id augue ut feugiat donec porttitor neque.
            Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor
            lacus, eget nunc lectus in tellus, pharetra, porttitor. Ipsum sit
            mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non
            pellentesque congue eget consectetur turpis. Sapien, dictum molestie
            sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit
            eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh
            orci.
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-3xl font-medium text-gray-900">
            How long do we keep your information?
          </h3>
          <p>
            Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla
            odio nisl vitae. In aliquet pellentesque aenean hac vestibulum
            turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada
            fringilla. Elit nisi in eleifend sed nisi. Pulvinar at orci, proin
            imperdiet commodo consectetur convallis risus. Sed condimentum enim
            dignissim adipiscing faucibus consequat, urna. Viverra purus et erat
            auctor aliquam. Risus, volutpat vulputate posuere purus sit congue
            convallis aliquet. Arcu id augue ut feugiat donec porttitor neque.
            Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor
            lacus, eget nunc lectus in tellus, pharetra, porttitor. Ipsum sit
            mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non
            pellentesque congue eget consectetur turpis. Sapien, dictum molestie
            sem tempor. Diam elit, orci, tincidunt aenean tempus. Quis velit
            eget ut tortor tellus. Sed vel, congue felis elit erat nam nibh
            orci.
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-3xl font-medium text-gray-900">
            Do we use cookies and other tracking technologies?
          </h3>
          <p>
            Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla
            odio nisl vitae. In aliquet pellentesque aenean hac vestibulum
            turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada
            fringilla. Elit nisi in eleifend sed nisi.{" "}
          </p>
        </div>
      </div>
    </>
  );
}
