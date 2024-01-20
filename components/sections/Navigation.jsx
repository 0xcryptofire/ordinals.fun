/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment } from "react";
import Nav from "react-bootstrap/Nav";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { Menu, Transition } from "@headlessui/react";
import { FaWallet } from "react-icons/fa";

export default function Navigation() {
  return (
    <Nav className="links-block">
      <div className="md:flex md:justify-center md:items-center md:mx-0 lg:mx-1 md:text-sm lg:text-lg hidden ">
        <Link className="font-semibold" href="/">
          LiteMap
        </Link>
      </div>
      <div className="md:flex md:justify-center md:items-center md:mx-0 lg:mx-1 md:text-sm lg:text-lg hidden ">
        <Link className="font-semibold" href="/collections">
          NFTs
        </Link>
      </div>
      <div className="md:flex md:justify-center md:items-center md:mx-0 lg:mx-1 md:text-sm lg:text-lg hidden ">
        <Link className="font-semibold" href="/ltc-20">
          LTC-20
        </Link>
      </div>
      <div className="md:flex md:justify-center md:items-center md:mx-0 lg:mx-1 md:text-sm lg:text-lg hidden ">
        <Link className="font-semibold" href="/others">
          Others
        </Link>
      </div>
      <div className="md:flex md:justify-center md:items-center md:mx-0 lg:mx-1 md:text-sm lg:text-lg hidden ">
        <Link className="font-semibold" href="/inscribe">
          Inscribe
        </Link>
      </div>
      <div className="md:flex md:justify-center md:items-center md:mx-0 lg:mx-1 md:text-sm lg:text-lg hidden ">
        <Link className="font-semibold" href="/wallet/litemaps">
          Wallet
        </Link>
      </div>

      <div className="md:flex md:justify-center md:items-center md:mx-0 lg:mx-1 md:text-sm lg:text-lg hidden ">
        <Link className="font-semibold" href="/orders">
          Orders
        </Link>
      </div>

      <Menu as="div" className="relative inline-block text-left md:hidden">
        <div className="flex justify-center items-center">
          <Menu.Button className="bg-transparent rounded focus:outline-none  my-auto  flex justify-center items-center cursor-pointer transition ease-out h-full p-0">
            <GiHamburgerMenu className="text-3xl p-0 my-3" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="fixed right-0  w-full px-3 mt-3 origin-top-right z-50  divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="transition ease-in-out  backdrop-blur-3xl rounded-lg">
              <ul className="rounded drop-shadow-md shadow-black py-1">
                <li className="py-2 px-3 flex hover:bg-gray-400/20 transition ease-out cursor-pointer">
                  <Link className="font-semibold" href="/">
                    LiteMap
                  </Link>
                </li>
                <li className="py-2 px-3 flex hover:bg-gray-400/20 transition ease-out cursor-pointer">
                  <Link className="font-semibold" href="/collections">
                    NFTs
                  </Link>
                </li>
                <li className="py-2 px-3 flex hover:bg-gray-400/20 transition ease-out cursor-pointer">
                  <Link className="font-semibold" href="/ltc-20">
                    LTC-20
                  </Link>
                </li>
                <li className="py-2 px-3 flex hover:bg-gray-400/20 transition ease-out cursor-pointer">
                  <Link className="font-semibold" href="/others">
                    Others
                  </Link>
                </li>
                <li className="py-2 px-3 flex hover:bg-gray-400/20 transition ease-out cursor-pointer">
                  <Link className="font-semibold" href="/inscribe">
                    Inscribe
                  </Link>
                </li>
                <li className="py-2 px-3 flex hover:bg-gray-400/20 transition ease-out cursor-pointer">
                  <Link className="font-semibold" href="/wallet/litemaps">
                    Wallet
                  </Link>
                </li>

                <li className="py-2 px-3 flex hover:bg-gray-400/20 transition ease-out cursor-pointer">
                  <Link className="font-semibold" href="/orders">
                    Orders
                  </Link>
                </li>
              </ul>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </Nav>
  );
}
