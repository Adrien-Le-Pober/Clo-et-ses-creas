import { useEffect, useRef, useState } from "react";
import logo from '../../assets/images/logo.jpg';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router";
import { useSession } from "~/core/session/SessionContext";
import { useCart } from "~/features/cart/CartContext";

export default function Navbar() {
    const { isAuthenticated, logout } = useSession();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const profileRef = useRef<HTMLDivElement | null>(null);
    const iconRef = useRef<SVGSVGElement | null>(null);

    const { state } = useCart();
    const cartQuantity = state.items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node) &&
                iconRef.current &&
                !iconRef.current.contains(event.target as Node)
            ) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                        <Link to="/creations" className="font-medium hover:underline">
                            Créations
                        </Link>
                        <Link to="#cadeaux" className="font-medium hover:underline">
                            Cadeaux
                        </Link>
                        <Link to="/contact" className="font-medium hover:underline">
                            Contact
                        </Link>
                        <Link to="/mon-histoire" className="font-medium hover:underline">
                            Mon histoire
                        </Link>
                    </div>

                    {/* Icons */}
                    <div className="md:flex items-center space-x-4">
                        <a href="#favorites">
                            <FavoriteBorderOutlinedIcon className="lg:w-9 lg:h-9" />
                        </a>
                        <Link to="/panier" className="relative">
                            <ShoppingBagOutlinedIcon className="lg:w-9 lg:h-9"/>
                            {cartQuantity > 0 && (
                                <span className="
                                    absolute -bottom-1 -right-1
                                    bg-secondary text-primary
                                    rounded-full
                                    w-5 h-5
                                    flex items-center justify-center
                                    text-xs font-bold
                                ">
                                    {cartQuantity}
                                </span>
                            )}
                        </Link>
                        <a href="#profile">
                            <PersonIcon
                                className="lg:w-9 lg:h-9"
                                onClick={() => setIsProfileOpen(prev => !prev)}
                                ref={iconRef}
                            />
                        </a>
                    </div>

                    {/* Profile menu */}
                    {isProfileOpen && (
                            <div 
                                ref={profileRef}
                                className="absolute right-0 top-16 lg:top-32 mt-2 w-56 origin-top-right rounded-md bg-secondary text-primary shadow-lg"
                            >
                                <div className="py-1">
                                    {isAuthenticated ? (
                                        <>
                                            <Link to="/mon-compte/profil" className="block px-4 py-2">Mon compte</Link>
                                            <button onClick={logout} type="button" className="bg-red-500 px-4 py-2 rounded">
                                                Déconnexion
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/connexion" className="block px-4 py-2">Connexion</Link>
                                            <Link to="/inscription" className="block px-4 py-2">Inscription</Link>
                                        </>
                                    )}
                                </div>
                            </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center justify-center">
                <button
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className="text-secondary focus:outline-none"
                    type="button"
                >
                    <MenuIcon />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-primary text-secondary">
                    <Link
                        to="/creations"
                        className="block px-4 py-2 text-sm font-medium hover:bg-secondary hover:text-primary"
                    >
                        Créations
                    </Link>
                    <Link
                        to="#cadeaux"
                        className="block px-4 py-2 text-sm font-medium hover:bg-secondary hover:text-primary"
                    >
                        Cadeaux
                    </Link>
                    <Link
                        to="/contact"
                        className="block px-4 py-2 text-sm font-medium hover:bg-secondary hover:text-primary"
                    >
                        Contact
                    </Link>
                    <Link
                        to="/mon-histoire"
                        className="block px-4 py-2 text-sm font-medium hover:bg-secondary hover:text-primary"
                    >
                        Mon histoire
                    </Link>
                </div>
            )}
        </nav>
    );
}
