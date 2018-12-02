<?php

class Discussion extends DbObject {
    // name of database table
    const DB_TABLE = 'discussion';

    // database fields
    protected $id;
    protected $time;
    protected $topic;
    protected $uid;
    protected $content;

    // constructor
    public function __construct($args = array()) {
        $defaultArgs = array(
            'id' => null,
            'uid' => 0,
            'time' => '',
            'topic' => null,
            'content' => ''
            );

        $args += $defaultArgs;

        $this->id = $args['id'];
        $this->uid = $args['uid'];
        $this->time = $args['time'];
        $this->topic = $args['topic'];
        $this->content = $args['content'];
    }

    // save changes to object
    public function save() {
        $db = Db::instance();
        // omit id and any timestamps
        $db_properties = array(
            'id' => $this->id,
            'uid' => $this->uid,
            'time' => $this->time,
            'topic' => $this->topic,
            'content' => $this->content
            );
        $db->store($this, __CLASS__, self::DB_TABLE, $db_properties);
    }

    // load object by ID
    public static function loadById($id) {
        $db = Db::instance();
        $obj = $db->fetchById($id, __CLASS__, self::DB_TABLE);
        return $obj;
    }

    // load all Discussions
    public static function getAllDiscussion($limit=null) {
        $query = sprintf(" SELECT * FROM %s ORDER BY time ASC ",
            self::DB_TABLE
            );
        $db = Db::instance();
        $result = $db->lookup($query);
        if(!mysql_num_rows($result))
            return null;
        else {
            return ($result);
        }
    }

}