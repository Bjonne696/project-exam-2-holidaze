import { Button, Menu, Navbar } from "react-daisyui";
import { Link, NavLink, Outlet } from "react-router-dom";
import Footer from "../Footer";


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
                <Outlet /> {/* This will render the matched child route */}
            </div>
            <Footer /> {/* Footer is part of the layout, so it's included here */}
        </>
    );
}

export default Layout;