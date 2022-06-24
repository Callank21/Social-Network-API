const { User, Thought } = require('../models');

const thoughtController = {
    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
      },

      //get single thought
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    //create a thought
    createThought({ params, body }, res) {
        console.log(params);
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
              { _id: body.userId },
              { $push: { thoughts: _id } },
              { new: true }
            );
          })
          .then(dbThoughtData => {
            console.log(dbThoughtData);
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
    },

    //add a reaction to a thought
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: {reactions: body}},
            {new: true, runValidators: true}
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'no thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    //edit a thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {new: true})
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    //delete a thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    //delete a reaction to a thought
    removeReaction({ params }, res) {
        Thought.findOneAndDelete(
            {_id: params.thoughtId},
            { $pull: { reactions: { reactionId: params.reactionId}}},
            {new: true }
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;