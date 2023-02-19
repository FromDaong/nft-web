import "./globals.css";

export default function Layout({children}) {
	return (
		<html>
			<body className="antialiased">{children}</body>
		</html>
	);
}
