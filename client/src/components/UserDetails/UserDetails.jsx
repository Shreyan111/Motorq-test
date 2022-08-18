import React, {useEffect} from 'react';
import { Paper, Typography } from '@material-ui/core/';
import { useDispatch } from 'react-redux';
import { getregisteredPosts } from '../../actions/posts';

const User = () => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const id = user.result._id;

    useEffect(() => {
        dispatch(getregisteredPosts(id));
    }, [dispatch, id]);
    return (
        <Paper>
            <div>
                <div>
                    <Typography variant="h3" component="h2">Registered Events</Typography>
                </div>
            </div>
        </Paper>
    );
};

export default User;