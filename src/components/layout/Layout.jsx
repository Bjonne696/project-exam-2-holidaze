import { Button, Menu, Navbar } from "react-daisyui";
import { Link, NavLink, Outlet } from "react-router-dom";

function Layout() {
	return (
		<>
			<Navbar>
				<div className="flex-1">
					<Button tag={Link} to="/" className="text-xl normal-case" color="ghost">
						Typeahead Example
					</Button>
				</div>
				<div className="flex-none">
					<Menu horizontal={true} className="px-1">
						<Menu.Item>
							<NavLink to="/">Home</NavLink>
						</Menu.Item>
					</Menu>
				</div>
			</Navbar>
			<div className="container mx-auto">
				<Outlet />
			</div>
		</>
	);
}

export default Layout;
