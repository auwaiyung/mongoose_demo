var express = require('express');
var mongoose = require('mongoose');
var co = require('co');
var async = require('async');
var db = mongoose.connect('mongodb://localhost/au');

var app = express();

app.get('/', function (req, res) {
    co(function* () {

        var Schema = mongoose.Schema;

        var options = { discriminatorKey: 'kind' };

        var eventSchema = new mongoose.Schema({ time: Date }, options);
        var Event = mongoose.model('Event', eventSchema);

        var ClickedLinkEvent = Event.discriminator('ClickedLink',
            new mongoose.Schema({ url: String }, options));

        var SignedUpEvent = Event.discriminator('SignedUp', new mongoose.Schema({ user: String }, options));

        var event1 = new Event({ time: Date.now() });
        var event2 = new ClickedLinkEvent({ time: Date.now(), url: 'google.com' });
        var event3 = new SignedUpEvent({ time: Date.now(), user: 'testuser' });

        var save = function (doc, callback) {
            doc.save(function (error, doc) {
                callback(error, doc);
            });
        };

        async.map([event1, event2, event3], save, function (error) {
            Event.count({}, function (error, count) {
                console.log(count);
            });
        });
        /*
        var userSchema = new Schema({
            name: String,
            friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
        });

        var User = mongoose.model('User', userSchema);

        User.findOne({ _id: '585baa47fd04433f3f07612f' }, function (err, a) {
            User.findOne({ _id: '585baa47fd04433f3f076130' }, function (err, b) {
                User.findOne({ _id: '585baa47fd04433f3f076131' }, function (err, c) {
                    var f = new User({ name: 'f', friends: [a, b, c] });
                    f.save();

                    a.friends = [
                        b, c
                    ];
                    a.save();

                    b.friends = [
                        a, c
                    ]
                    b.save();

                    c.friends = [
                        a, b
                    ];
                    c.save();
                })
            })
        });

        var a = User.
            findOne({ name: 'f' }).
            sort({ _id: -1 }).
            populate({
                path: 'friends',
                populate: {
                    path: 'friends',
                    populate: {
                        path: 'friends'
                    }
                }
            }).exec();
        a.then(function (result) {
            res.send(arguments);
        });
        */

        /*
        var a = new User({
            name: '1',
            friends: [

            ]
        });


        var a = new User({ name: 'a' });
        a.save();
        var b = new User({ name: 'b' });
        b.save();
        var c = new User({ name: 'c' });
        c.save();
        var d = new User({ name: 'd' });
        d.save();
        var e = new User({ name: 'e' });
        e.save();
        */


        /*
        var personSchema = Schema({
            _id: Number,
            name: String,
            age: Number,
            stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
        });
    
        var storySchema = Schema({
            _creator: { type: Number, ref: 'Person' },
            title: String,
            fans: [{ type: Number, ref: 'Person' }]
        });
    
        var Story = mongoose.model('Story', storySchema);
        var Person = mongoose.model('Person', personSchema);
        */

        /*
        var aaron = new Person({ _id: 7, name: 'Aaron', age: 100 });
        var a = new Person({ _id: 8, name: 'I am a fans 1', age: 1 });
        var b = new Person({ _id: 9, name: 'I am a fans 2', age: 2 });
        a.save();
        b.save();
        aaron.save(function (err) {
            console.log(arguments[1]);
            console.log(arguments[1] === aaron);
            if (err) console.log(err);
    
            var story1 = new Story({
                title: "Once upon a timex.",
                _creator: arguments[1],
                fans: [
                    a, b
                ]
                // _creator: aaron._id    // assign the _id from the person
            });
    
            story1.save(function (err) {
                if (err) return console.log(err);
                // thats it!
            });
        });
        */

        /*
        Story
            .findOne({ title: 'Once upon a timex.' })
            .populate('fans _creator')
            .sort({ '_id': -1 })
            .exec(function (err, story) {
                if (err) console.log(err);
                res.send(story);
                // console.log('The creator is %s', story._creator.name);
                // prints "The creator is Aaron"
            });
        */

        /*
        Story
            .findOne({ title: 'Once upon a timex.' })
            .sort({ '_id': -1 })
            .populate({
                path: 'fans',
                match: { age: { $gte: 1 } },
                select: 'name -_id',
                options: { limit: 5 }   
            })
            .exec(function (err, result) {
                res.send(result);
            });
        */

        /*
        var Schema = mongoose.Schema;
        var personSchema = new Schema({
            name: String,
            type: String,
            role: { type: String, default: 'guitarist' }
        });
    
        var Person = mongoose.model('Person', personSchema);
        */

        /*
        var cursor = Person.find({ name: 'Ghost' }).cursor();
        cursor.on('data', function (doc) {
            // Called once for every document
            console.log(doc);
        });
    
        cursor.on('close', function () {
            // Called when done
            console.log('end');
        });
        */

        /*
        Person.
            find({
                'name': 'Ghost',
            }).
            limit(10).
            sort({ type: -1 }).
            select({ name: 1, type: 1 }).
            exec(function (err, people) {
                res.send(people);
            });
        */

        /*
        var personSchema = new Schema({
            name: String,
            type: String,
            role: { type: String, default: 'guitarist' }
        });
        var Person = mongoose.model('Person', personSchema);
    
        // var new_person = new Person({
        //     name: 'Ghost',
        //     type: 'teacher',
        //     role: 'ttt'
        // });
        // new_person.save();
    
        Person.find({ 'name': 'Ghost' }, 'name role',function (err, people) {
            if (err) {
                console.log(err);
            }
            console.log(people);
        });
        */

        /*
        // default 
        var schema = new Schema({
            name: String,
            role: { type: String, default: 'guitarist' }
        });
    
        var Person = db.model('Person', schema);
    
        var axl = new Person({ name: 'Axl Rose', role: 'singer' });
        console.log(axl.role);      // singer
    
        var slash = new Person({ name: 'Slash' });
        console.log(slash.role);    // guitarist
    
        var izzy = new Person({ name: 'Izzy', role: undefined });
        console.log(izzy.role);     // guitarist 
    
        var foo = new Person({ name: 'Foo', role: null });
        console.log(foo.role);      // null
    
        var schema = new Schema({
            title: String,
            date: {
                type: Date,
                // `Date.now()` returns the current unix timestamp as a number
                default: Date.now
            }
        });
    
        var BlogPost = db.model('BlogPost', schema);
    
        var post = new BlogPost({ title: '5 Best Arnold Schwarzenegger Movies' });
    
        // The post has a default Date set to now
        console.log(post.date.getTime());
        console.log(post.date);
        */

        /*
        var childSchema = new Schema({ name: 'string' });
    
        var parentSchema = new Schema({
            child: childSchema
        });
    
        childSchema.pre('save', function (next) {
            console.log(this.name);
            next();
        });
        var Parent = mongoose.model('Parent', parentSchema);
        var parent = new Parent({ child: { name: 'Luke' } })
        parent.child.name = 'Leia';
        parent.save(function () {
            console.log(arguments);
        });
        */

        /*
        var childSchema = new Schema({ name: 'string' });
     s
        var parentSchema = new Schema({
            children: [childSchema]
        });
     
        var Parent = mongoose.model('Parent', parentSchema);
        var parent = new Parent({ children: [{ name: 'Matt222' }, { name: 'Sarah22' }] })
        parent.children[0].name = 'Matthew222';
        parent.save();
        */
    });
});

app.listen(3000, function () {
    console.log('app is listening at port 3000');
});