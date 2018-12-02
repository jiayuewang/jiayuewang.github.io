<?php

class User extends DbObject {
    // name of database table
    const DB_TABLE = 'user';

    // database fields
    protected $id;
    protected $username;
    protected $password;
    protected $first_name;
    protected $last_name;
    protected $dob;
    protected $ssn;
    protected $bank_account;
    protected $email;
	protected $perm;
    protected $point;
    protected $membership_start;
    protected $membership_end;

    // constructor
    public function __construct($args = array()) {
        $defaultArgs = array(
            'id' => null,
            'username' => '',
            'password' => '',
            'email' => null,
            'first_name' => null,
            'last_name' => null,
			'perm' => 1,
			'point' => 0,
            'dob' => null,
            'ssn' => null,
            'bank_account' => null,
            'membership_start' => null,
            'membership_end' => null
            );

        $args += $defaultArgs;

        $this->id = $args['id'];
        $this->username = $args['username'];
        $this->password = $args['password'];
        $this->email = $args['email'];
        $this->first_name = $args['first_name'];
        $this->last_name = $args['last_name'];
		$this->perm = $args['perm'];
        $this->point = $args['point'];
        $this->dob = $args['dob'];
        $this->ssn = $args['ssn'];
        $this->bank_account = $args['bank_account'];
        $this->membership_start = $args['membership_start'];
        $this->membership_end = $args['membership_end'];
	}

    // save changes to object
    public function save() {
        $db = Db::instance();
        // omit id and any timestamps
        $db_properties = array(
            'password' => $this->password,
            'email' => $this->email,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'bank_account' => $this->bank_account,
            'perm' => $this->perm

        );
        $db->store($this, __CLASS__, self::DB_TABLE, $db_properties);
    }

    // load object by ID
    public static function loadById($id) {
        $db = Db::instance();
        $obj = $db->fetchById($id, __CLASS__, self::DB_TABLE);
        return $obj;
    }

    // load user by username
    public static function loadByUsername($username=null) {
        if($username === null)
            return null;

        $query = sprintf(" SELECT id FROM %s WHERE username = '%s' ",
            self::DB_TABLE,
            $username
            );
        $db = Db::instance();
        $result = $db->lookup($query);
        if(!mysql_num_rows($result))
            return null;
        else {
            $row = mysql_fetch_assoc($result);
            $obj = self::loadById($row['id']);
            return ($obj);
        }
    }
}
