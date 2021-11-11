import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/client';
import Image from 'next/image';
import Link from 'next/link';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InputIcon from '@material-ui/icons/Input';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { HeaderWrapper, ToolbarWrapper } from './style';

const Header = () => {
    const [session] = useSession();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        signOut();
    };

    return (
        <HeaderWrapper elevation={0}>
            <ToolbarWrapper>
                <>
                    <Link href="/" passHref>
                        <Box component="a" display="flex">
                            <Image
                                src="/neanias.png"
                                alt="Neanias Logo"
                                width="60"
                                height="48"
                            />
                        </Box>
                    </Link>
                </>
                <>
                    {session ? (
                        <>
                            <Avatar
                                aria-controls="user-menu"
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                {session.user.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </Avatar>
                            <Menu
                                id="user-menu"
                                anchorEl={anchorEl}
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <ExitToAppIcon fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Avatar onClick={signIn}>
                            <InputIcon />
                        </Avatar>
                    )}
                </>
            </ToolbarWrapper>
        </HeaderWrapper>
    );
};

export default Header;
