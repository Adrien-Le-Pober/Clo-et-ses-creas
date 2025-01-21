import { useState } from "react";
import logo from '../../assets/images/logo.jpg';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-primary text-secondary">
            <div className="pe-4 sm:pe-6 lg:pe-10 xl:pe-24">
                <div className="flex justify-between items-center h-28 lg:h-56">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/">
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-28 lg:h-56 w-auto"
                            />
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 text-lg lg:text-2xl xl:text-4xl">
                        <a href="#creations" className="font-medium hover:underline">
                            Créations
                        </a>
                        <a href="#cadeaux" className="font-medium hover:underline">
                            Cadeaux
                        </a>
                        <a href="#contact" className="font-medium hover:underline">
                            Contact
                        </a>
                        <a href="#mon-histoire" className="font-medium hover:underline">
                            Mon histoire
                        </a>
                    </div>

                    {/* Icons */}
                    <div className="md:flex items-center space-x-4">
                        <a href="#favorites">
                            <FavoriteBorderOutlinedIcon className="lg:w-9 lg:h-9" />
                        </a>
                        <a href="#cart">
                            <ShoppingBagOutlinedIcon className="lg:w-9 lg:h-9"/>
                        </a>
                        <a href="#profile">
                            <PersonIcon className="lg:w-9 lg:h-9" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center justify-center">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-secondary focus:outline-none"
                >
                    <MenuIcon />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-primary text-secondary">
                    <a
                        href="#creations"
                        className="block px-4 py-2 text-sm font-medium hover:bg-secondary hover:text-primary"
                    >
                        Créations
                    </a>
                    <a
                        href="#cadeaux"
                        className="block px-4 py-2 text-sm font-medium hover:bg-secondary hover:text-primary"
                    >
                        Cadeaux
                    </a>
                    <a
                        href="#contact"
                        className="block px-4 py-2 text-sm font-medium hover:bg-secondary hover:text-primary"
                    >
                        Contact
                    </a>
                    <a
                        href="#mon-histoire"
                        className="block px-4 py-2 text-sm font-medium hover:bg-secondary hover:text-primary"
                    >
                        Mon histoire
                    </a>
                </div>
            )}
        </nav>
    );
}
