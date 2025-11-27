import { Box } from '@mui/material';
import React from 'react';
import styles from './style.module.scss'
import NewSectionsBlock from './NewSectionsBlock';

function NewTabSections(props) {
    return (
        <div className={styles.section}>
            <NewSectionsBlock/>
        </div>
    );
}

export default NewTabSections;