import { AppBar, Box, Modal, IconButton, Toolbar, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
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
                <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
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
                <Typography variant='body1'>Enter your formula, submit it (double negations will be removed), see the variables and formulas, and check its statement clasification.</Typography>                
                <Typography variant='body1'><strong>Symbols</strong>:</Typography>
                <ul>
                    <li><Typography variant='body1'><strong>VARIABLES:</strong> Letters.</Typography></li>
                    <li><Typography variant='body1'><strong>CONJUNCTION:</strong> ^, ∧, &&</Typography></li>
                    <li><Typography variant='body1'><strong>DISJUNCTION:</strong> ||, ∨ </Typography></li>
                    <li><Typography variant='body1'><strong>EXCLUSIVE DISJUNCTION:</strong> |, ⊻ </Typography></li>
                    <li><Typography variant='body1'><strong>IMPLICATION:</strong> ->, ⇒, ⊃, →</Typography></li>
                    <li><Typography variant='body1'><strong>EQUIVALENCE:</strong> {'<->'}, ↔ </Typography></li>
                    <li><Typography variant='body1'><strong>NEGATION:</strong> !, ¬, ~</Typography></li>
                </ul>
            </Box>
        </Modal>
    </>
  );
};

export default Title;