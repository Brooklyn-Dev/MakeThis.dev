import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "@/components/NavBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<NavBar />
					<main className="flex-grow">{children}</main>
				</Providers>
				<Toaster richColors closeButton duration={3000} />
			</body>
		</html>
	);
}
