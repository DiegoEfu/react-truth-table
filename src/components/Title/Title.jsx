import { AppBar, Box, Modal, IconButton, Toolbar, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import React from 'react';

const Title = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #FFF',
        boxShadow: 24,
        p: 4
    };

    return (
    <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                    Truth Table Calculator
                </Typography>
                <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={handleOpen}
                >
                    <InfoIcon />
                </IconButton>

                <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <LanguageIcon />
                </IconButton>
                </Toolbar>
            </AppBar>
        </Box>

        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h4">
                    Instructions
                </Typography>
                <ol>
                    <li><Typography variant="body1">Enter your logic formula.</Typography></li>
                    <li><Typography variant="body1">Click enter.</Typography></li>
                    <li><Typography variant="body1">If the formula is correct, you'll see your variables and truth tables, with 0s and 1s or Ts and Fs.</Typography></li>
                    <li><Typography variant="body1">You will be shown the type of statement:</Typography>
                        <ul>
                            <li><Typography variant='body1'><strong>TAUTOLOGY</strong> if all the combinations are true.</Typography></li>
                            <li><Typography variant='body1'><strong>CONTINGENCY</strong> if there are both true and false combinations.</Typography></li>
                            <li><Typography variant='body1'><strong>CONTRADICTION</strong> if all the combinations are false.</Typography></li>
                        </ul>
                    </li>
                </ol>
                <Typography variant='body1'><strong>NOTE</strong>: If your formula is not correct, then a message with the error will be shown.</Typography>
            </Box>
        </Modal>
    </>
  )
};

export default Title;