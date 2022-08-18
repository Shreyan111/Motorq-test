import React, { useEffect } from 'react';
import { Paper, Typography } from '@material-ui/core/';
import { Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getregisteredPosts } from '../../actions/posts';
import useStyles from './styles';
import Post from './Post/Post';

const User = ({ setCurrentId }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const id = user.result._id;

    useEffect(() => {
        dispatch(getregisteredPosts(id));
    }, [dispatch, id]);

    const { posts } = useSelector((state) => state.posts);

    console.log(posts);

    if (!posts.length) return 'No Events Registered';
    return (
        <>
            <Paper>
                <div>
                    <div>
                        <Typography variant="h3" component="h2">Registered Events</Typography>
                    </div>
                </div>
            </Paper>
            <Grid className={classes.container} container alignItems="stretch" spacing={3}>
                {posts?.map((post) => (
                    <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>
                        <Post post={post} setCurrentId={setCurrentId} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default User;