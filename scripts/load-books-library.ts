import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Complete list of 139 books from your library
const books = [
  { title: 'Designing Your Life', authors: 'Bill Burnett & Dave Evans', category: 'Career' },
  { title: 'Drive', authors: 'Daniel H. Pink', category: 'Motivation' },
  { title: 'Grit', authors: 'Angela Duckworth', category: 'Personal Development' },
  { title: 'Mindset', authors: 'Carol S. Dweck', category: 'Personal Development' },
  { title: 'Peak', authors: 'Anders Ericsson & Robert Pool', category: 'Learning' },
  { title: 'Range', authors: 'David Epstein', category: 'Learning' },
  { title: 'So Good They Can\'t Ignore You', authors: 'Cal Newport', category: 'Career' },
  { title: 'The 2-Hour Job Search', authors: 'Steve Dalton', category: 'Career' },
  { title: 'The First 90 Days', authors: 'Michael D. Watkins', category: 'Career' },
  { title: 'What Color Is Your Parachute?', authors: 'Richard N. Bolles', category: 'Career' },
  { title: 'Atomic Habits', authors: 'James Clear', category: 'Habits' },
  { title: 'Deep Work', authors: 'Cal Newport', category: 'Productivity' },
  { title: 'Eat That Frog!', authors: 'Brian Tracy', category: 'Productivity' },
  { title: 'Essentialism', authors: 'Greg McKeown', category: 'Productivity' },
  { title: 'Getting Things Done', authors: 'David Allen', category: 'Productivity' },
  { title: 'Make Time', authors: 'Jake Knapp & John Zeratsky', category: 'Productivity' },
  { title: 'The One Thing', authors: 'Gary Keller & Jay Papasan', category: 'Focus' },
  { title: 'The Power of Habit', authors: 'Charles Duhigg', category: 'Habits' },
  { title: 'Tiny Habits', authors: 'BJ Fogg', category: 'Habits' },
  { title: 'Ultralearning', authors: 'Scott Young', category: 'Learning' },
  { title: 'HBR Guide to Better Business Writing', authors: 'Bryan A. Garner', category: 'Writing' },
  { title: 'Made to Stick', authors: 'Chip Heath & Dan Heath', category: 'Communication' },
  { title: 'On Writing Well', authors: 'William Zinsser', category: 'Writing' },
  { title: 'Presentation Zen', authors: 'Garr Reynolds', category: 'Presentation' },
  { title: 'Resonate', authors: 'Nancy Duarte', category: 'Presentation' },
  { title: 'Talk Like TED', authors: 'Carmine Gallo', category: 'Presentation' },
  { title: 'The Elements of Style', authors: 'William Strunk Jr. & E. B. White', category: 'Writing' },
  { title: 'The Pyramid Principle', authors: 'Barbara Minto', category: 'Communication' },
  { title: 'The Sense of Style', authors: 'Steven Pinker', category: 'Writing' },
  { title: 'Writing That Works', authors: 'Kenneth Roman & Joel Raphaelson', category: 'Writing' },
  { title: 'Crucial Conversations', authors: 'Kerry Patterson, Joseph Grenny, Ron McMillan & Al Switzler', category: 'Communication' },
  { title: 'Getting to Yes', authors: 'Roger Fisher, William Ury & Bruce Patton', category: 'Negotiation' },
  { title: 'Give and Take', authors: 'Adam Grant', category: 'Relationships' },
  { title: 'How to Win Friends and Influence People', authors: 'Dale Carnegie', category: 'Relationships' },
  { title: 'Influence', authors: 'Robert B. Cialdini', category: 'Psychology' },
  { title: 'Never Eat Alone', authors: 'Keith Ferrazzi & Tahl Raz', category: 'Networking' },
  { title: 'Never Split the Difference', authors: 'Chris Voss & Tahl Raz', category: 'Negotiation' },
  { title: 'Pre-Suasion', authors: 'Robert B. Cialdini', category: 'Psychology' },
  { title: 'The Charisma Myth', authors: 'Olivia Fox Cabane', category: 'Communication' },
  { title: 'The Like Switch', authors: 'Jack Schafer & Marvin Karlins', category: 'Relationships' },
  { title: 'Extreme Ownership', authors: 'Jocko Willink & Leif Babin', category: 'Leadership' },
  { title: 'High Output Management', authors: 'Andrew S. Grove', category: 'Management' },
  { title: 'Leaders Eat Last', authors: 'Simon Sinek', category: 'Leadership' },
  { title: 'Multipliers', authors: 'Liz Wiseman', category: 'Leadership' },
  { title: 'Radical Candor', authors: 'Kim Scott', category: 'Management' },
  { title: 'Team of Teams', authors: 'Stanley McChrystal', category: 'Leadership' },
  { title: 'The Culture Code', authors: 'Daniel Coyle', category: 'Culture' },
  { title: 'The Effective Executive', authors: 'Peter F. Drucker', category: 'Management' },
  { title: 'The Five Dysfunctions of a Team', authors: 'Patrick Lencioni', category: 'Team' },
  { title: 'Turn the Ship Around!', authors: 'L. David Marquet', category: 'Leadership' },
  { title: 'Blue Ocean Strategy', authors: 'W. Chan Kim & Renée Mauborgne', category: 'Strategy' },
  { title: 'Execution', authors: 'Larry Bossidy & Ram Charan', category: 'Strategy' },
  { title: 'Good to Great', authors: 'Jim Collins', category: 'Strategy' },
  { title: 'HBR\'s 10 Must Reads on Strategy', authors: 'Harvard Business Review', category: 'Strategy' },
  { title: 'Measure What Matters', authors: 'John Doerr', category: 'Goals' },
  { title: 'Playing to Win', authors: 'A.G. Lafley & Roger L. Martin', category: 'Strategy' },
  { title: 'The Balanced Scorecard', authors: 'Robert S. Kaplan & David P. Norton', category: 'Metrics' },
  { title: 'The Goal', authors: 'Eliyahu M. Goldratt', category: 'Operations' },
  { title: 'The Innovator\'s Dilemma', authors: 'Clayton M. Christensen', category: 'Innovation' },
  { title: 'Working Backwards', authors: 'Colin Bryar & Bill Carr', category: 'Product' },
  { title: 'Continuous Discovery Habits', authors: 'Teresa Torres', category: 'Product' },
  { title: 'Crossing the Chasm', authors: 'Geoffrey A. Moore', category: 'Marketing' },
  { title: 'Empowered', authors: 'Marty Cagan & Chris Jones', category: 'Product' },
  { title: 'Escaping the Build Trap', authors: 'Melissa Perri', category: 'Product' },
  { title: 'Inspired', authors: 'Marty Cagan', category: 'Product' },
  { title: 'Lean Analytics', authors: 'Alistair Croll & Benjamin Yoskovitz', category: 'Analytics' },
  { title: 'Sprint', authors: 'Jake Knapp, John Zeratsky & Braden Kowitz', category: 'Product' },
  { title: 'The Lean Product Playbook', authors: 'Dan Olsen', category: 'Product' },
  { title: 'The Mom Test', authors: 'Rob Fitzpatrick', category: 'Product' },
  { title: 'Alchemy', authors: 'Rory Sutherland', category: 'Marketing' },
  { title: 'Building a StoryBrand', authors: 'Donald Miller', category: 'Marketing' },
  { title: 'Contagious', authors: 'Jonah Berger', category: 'Marketing' },
  { title: 'Hacking Growth', authors: 'Sean Ellis & Morgan Brown', category: 'Growth' },
  { title: 'Hooked', authors: 'Nir Eyal', category: 'Product' },
  { title: 'Marketing Management', authors: 'Philip Kotler & Kevin Lane Keller', category: 'Marketing' },
  { title: 'Play Bigger', authors: 'Al Ramadan, Dave Peterson, Christopher Lochhead & Kevin Maney', category: 'Strategy' },
  { title: 'Positioning', authors: 'Al Ries & Jack Trout', category: 'Marketing' },
  { title: 'Purple Cow', authors: 'Seth Godin', category: 'Marketing' },
  { title: 'This Is Marketing', authors: 'Seth Godin', category: 'Marketing' },
  { title: '101 Design Methods', authors: 'Vijay Kumar', category: 'Design' },
  { title: 'About Face', authors: 'Alan Cooper, Robert Reimann, David Cronin & Christopher Noessel', category: 'Design' },
  { title: 'Creative Confidence', authors: 'Tom Kelley & David Kelley', category: 'Design' },
  { title: 'Designing for the Digital Age', authors: 'Kim Goodwin', category: 'Design' },
  { title: 'Don\'t Make Me Think', authors: 'Steve Krug', category: 'UX' },
  { title: 'Lean UX', authors: 'Jeff Gothelf & Josh Seiden', category: 'Design' },
  { title: 'Refactoring UI', authors: 'Adam Wathan & Steve Schoger', category: 'Design' },
  { title: 'Seductive Interaction Design', authors: 'Stephen Anderson', category: 'Design' },
  { title: 'The Design of Everyday Things', authors: 'Don Norman', category: 'Design' },
  { title: 'The Elements of User Experience', authors: 'Jesse James Garrett', category: 'UX' },
  { title: 'An Introduction to Statistical Learning', authors: 'Gareth James, Daniela Witten, Trevor Hastie & Robert Tibshirani', category: 'Data' },
  { title: 'Be Data Literate', authors: 'Jordan Morrow', category: 'Data' },
  { title: 'Data Science for Business', authors: 'Foster Provost & Tom Fawcett', category: 'Data' },
  { title: 'How Charts Lie', authors: 'Alberto Cairo', category: 'Visualization' },
  { title: 'Naked Statistics', authors: 'Charles Wheelan', category: 'Statistics' },
  { title: 'Storytelling with Data', authors: 'Cole Nussbaumer Knaflic', category: 'Visualization' },
  { title: 'The Signal and the Noise', authors: 'Nate Silver', category: 'Data' },
  { title: 'The Visual Display of Quantitative Information', authors: 'Edward R. Tufte', category: 'Visualization' },
  { title: 'Thinking with Data', authors: 'Max Shron', category: 'Data' },
  { title: 'Weapons of Math Destruction', authors: 'Cathy O\'Neil', category: 'Data' },
  { title: 'A Philosophy of Software Design', authors: 'John Ousterhout', category: 'Engineering' },
  { title: 'Accelerate', authors: 'Nicole Forsgren, Jez Humble & Gene Kim', category: 'DevOps' },
  { title: 'Clean Architecture', authors: 'Robert C. Martin', category: 'Engineering' },
  { title: 'Clean Code', authors: 'Robert C. Martin', category: 'Engineering' },
  { title: 'Designing Data-Intensive Applications', authors: 'Martin Kleppmann', category: 'Engineering' },
  { title: 'System Design Interview', authors: 'Alex Xu', category: 'Engineering' },
  { title: 'The DevOps Handbook', authors: 'Gene Kim, Jez Humble, Patrick Debois & John Willis', category: 'DevOps' },
  { title: 'The Manager\'s Path', authors: 'Camille Fournier', category: 'Management' },
  { title: 'The Phoenix Project', authors: 'Gene Kim, Kevin Behr & George Spafford', category: 'DevOps' },
  { title: 'The Pragmatic Programmer', authors: 'Andrew Hunt & David Thomas', category: 'Engineering' },
  { title: 'Antifragile', authors: 'Nassim Nicholas Taleb', category: 'Philosophy' },
  { title: 'Noise', authors: 'Daniel Kahneman, Olivier Sibony & Cass R. Sunstein', category: 'Psychology' },
  { title: 'Nudge', authors: 'Richard H. Thaler & Cass R. Sunstein', category: 'Behavioral' },
  { title: 'Predictably Irrational', authors: 'Dan Ariely', category: 'Psychology' },
  { title: 'Skin in the Game', authors: 'Nassim Nicholas Taleb', category: 'Philosophy' },
  { title: 'Superforecasting', authors: 'Philip E. Tetlock & Dan Gardner', category: 'Decision Making' },
  { title: 'The Art of Thinking Clearly', authors: 'Rolf Dobelli', category: 'Thinking' },
  { title: 'The Checklist Manifesto', authors: 'Atul Gawande', category: 'Systems' },
  { title: 'The Paradox of Choice', authors: 'Barry Schwartz', category: 'Psychology' },
  { title: 'Thinking, Fast and Slow', authors: 'Daniel Kahneman', category: 'Psychology' },
  { title: 'A Technique for Producing Ideas', authors: 'James Webb Young', category: 'Creativity' },
  { title: 'Show Your Work!', authors: 'Austin Kleon', category: 'Creativity' },
  { title: 'Steal Like an Artist', authors: 'Austin Kleon', category: 'Creativity' },
  { title: 'Story', authors: 'Robert McKee', category: 'Storytelling' },
  { title: 'Storyworthy', authors: 'Matthew Dicks', category: 'Storytelling' },
  { title: 'The Anatomy of Story', authors: 'John Truby', category: 'Storytelling' },
  { title: 'The Artist\'s Way', authors: 'Julia Cameron', category: 'Creativity' },
  { title: 'The Creative Habit', authors: 'Twyla Tharp', category: 'Creativity' },
  { title: 'The Hero with a Thousand Faces', authors: 'Joseph Campbell', category: 'Storytelling' },
  { title: 'The War of Art', authors: 'Steven Pressfield', category: 'Creativity' },
  { title: 'A Random Walk Down Wall Street', authors: 'Burton G. Malkiel', category: 'Finance' },
  { title: 'Accounting Made Simple', authors: 'Mike Piper', category: 'Finance' },
  { title: 'Common Sense on Mutual Funds', authors: 'John C. Bogle', category: 'Finance' },
  { title: 'Financial Intelligence', authors: 'Karen Berman & Joe Knight', category: 'Finance' },
  { title: 'I Will Teach You to Be Rich', authors: 'Ramit Sethi', category: 'Finance' },
  { title: 'Rich Dad Poor Dad', authors: 'Robert T. Kiyosaki & Sharon Lechter', category: 'Finance' },
  { title: 'The Little Book of Common Sense Investing', authors: 'John C. Bogle', category: 'Finance' },
  { title: 'The Personal MBA', authors: 'Josh Kaufman', category: 'Business' },
  { title: 'The Psychology of Money', authors: 'Morgan Housel', category: 'Finance' },
  { title: 'The Simple Path to Wealth', authors: 'JL Collins', category: 'Finance' },
]

async function loadBooks() {
  try {
    console.log(`Starting to load ${books.length} books...`)

    // Clear existing books (optional)
    // await supabase.from('knowledge_base').delete().neq('id', 0)

    // Insert new books
    const { data, error } = await supabase
      .from('knowledge_base')
      .insert(
        books.map((book, index) => ({
          id: index + 1,
          title: book.title,
          authors: book.authors,
          category: book.category,
          description: '',
          cover_url: '',
          created_at: new Date().toISOString(),
        }))
      )
      .select()

    if (error) {
      console.error('Error inserting books:', error)
      return
    }

    console.log(`Successfully loaded ${data?.length || 0} books!`)
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

loadBooks()
