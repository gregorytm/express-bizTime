DROP DATABASE IF EXISTS biztime;

CREATE DATABASE biztime;

\c biztime

DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS company_industry CASCADE;


CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
    code TEXT PRIMARY KEY,
    industry TEXT 
);

CREATE TABLE company_industry (
  companies_code TEXT REFERENCES companies(code),
  industry_id TEXT REFERENCES industries,
  PRIMARY KEY(companies_code, industry_id)
);


INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries
VALUES
  ('acc', 'Accounting'),
  ('dev', 'Software Developer'),
  ('hr', 'Human Resources');

INSERT INTO company_industry
VALUES
  ('apple', 'acc'),
  ('apple', 'dev'),
  ('apple', 'hr'),
  ('ibm', 'acc'),
  ('ibm', 'dev'),
  ('ibm', 'hr')

-- SELECT c.code, c.name, c.description, i.industry
-- FROM companies AS c
-- LEFT JOIN company_industry AS ci
-- ON c.code = ci.companies_code
-- LEFT JOIN industries AS i
-- ON ci.industry_id = i.code

-- SELECT i.code, i.industry, c.name
-- FROM industries AS i
-- LEFT JOIN  company_industry AS ci
-- ON c.code = ci.companies_code
-- LEFT JOIN companies AS c
-- ON ci.companies_code = c.name
-- WHERE i.code = $1