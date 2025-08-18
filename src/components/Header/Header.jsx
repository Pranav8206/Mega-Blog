import React from 'react';
import { Container, LogoutBtn, Logo } from '../index';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Header() {
    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    const navItems = [
        { name: "Login", slug: "/login", active: !authStatus },
        { name: "Signup", slug: "/signup", active: !authStatus },
        { name: "All Posts", slug: "/all-posts", active: authStatus },
        { name: "Add Post", slug: "/add-post", active: authStatus },
    ];

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 shadow-lg border-b border-gray-300">
            <Container>
                <nav className="flex items-center justify-between py-3">
                    
                    <Link to="/" className="flex items-center pr-1 ">
                        <Logo width="120px" />
                    </Link>

                    <ul className="flex items-center space-x-1 sm:space-x-3">
                        {navItems.map((item) =>
                            item.active && (
                                <li key={item.name}>
                                    <button
                                        onClick={() => navigate(item.slug)}
                                        className={`
                                            flex items-center space-x-1 px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-medium
                                            transition-all duration-200 ease-in-out cursor-pointer
                                            ${window.location.pathname === item.slug
                                                ? 'bg-blue-400 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-blue-500 hover:text-white'}
                                        `}
                                    >
                                        <span className="hidden sm:inline">{item.name}</span>
                                        <span className="font-semibold sm:hidden">{item.name.split(" ")[0]}</span>
                                    </button>
                                </li>
                            )
                        )}

                        {authStatus && (
                            <li className="ml-1 sm:ml-4">
                                <LogoutBtn className="bg-gray-300 text-gray-800 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer" />
                            </li>
                        )}
                    </ul>
                </nav>
            </Container>
        </header>
    );
}

export default Header;
