const notes = require('../controllers/notes');
const pool = require('../utils/pool');

module.exports = class Note {
  id;
  title;
  content;
  createdAt;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.content = row.content;
    this.createdAt = row.created_at;
  }

  static async insert({ title, content }) {
    const { rows } = await pool.query(
      `
          INSERT INTO
            notes(title, content)
          VALUES  
            ($1, $2)
        RETURNING
            *
          `,
      [title, content]
    );
    return new Note(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
            SELECT
              title, content, created_at
            FROM
              notes
            `
    );
    return rows.map((row) => new notes(row));
  }
};
