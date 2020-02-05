# Multilingual rubric for evaluation of development of open content

A simple framework for comparing the explicit and implicit cost of developing, and relative differences between, various types of open content commonly used in eLearning. Inspired by [a rubric from Anstey and Watson (2018)](https://er.educause.edu/articles/2018/9/a-rubric-for-evaluating-e-learning-tools-in-higher-education).

Each type of learning object is given a score based on an evaluation, that is, a rating given to each sub-factor below. The values from these Likert-scales are normalized, aggregated for each factor, and used in a radar-map to indicate the overall and relative complexity between the types.

## Usage

Install and run [http-server](https://www.npmjs.com/package/http-server) from the cloned directory, or any other simple server-software, and edit `model.js` as needed. Language is set in the query-parameter `lang` with an ISO 639-1 language-code, `labels` holds all label-data, `data` all types-data.

MIT License 2020 - Ole Vik, NTNU

## Factor

### Openness

Whether the type meets the [OER-specification](http://opencontent.org/definition/), and results in resources that can be processed later, searched for, edited with free tools, and use an open format. A high degree of openness means that the content type is usable, accessible to developers, and to a small degree locked into given systems.

#### Materials

`0` - Completely locked  
`1` - Final product is available  
`2` - Involved resources are available  
`3` - Source materials (openly editable) are available  

#### Retrievable

`0` - Unsearchable  
`1` - Unsearchable, but can include metadata  
`2` - Searchable  
`3` - Searchable, and can include metadata  

#### Tools

`0` - Tools are proprietary  
`1` - Tools are free or available via site-licens  
`2` - Tools are open (source)  

#### Format

`0` - Format is closed and proprietary  
`1` - Format is open to certain software  
`2` - Format is open to a lot of software  
`3` - Format is open and standardized  

### Availability

The threshold of use for the end-user, where negative aspects such as ridigity, high degree of stimulation, and technical limitations are measured. If the content does not allow the user to control how it is consumed, then this constrains the end-users learning. Involving multiple senses can create engagement, but usually requires more concentration, and there is a danger that the learning is limited by overstimulation.

Some content will also require more technical equipment to use, which raises the threshold. Standards here include accessibility for users with disabilities, including vision, hearing or mechanic maneuverability, as well as whether the content can be [clearly perceived, distinguished, used, understood and interpreted](https://www.w3.org/WAI/fundamentals/accessibility-principles/).

#### Rigidity

`0` - User cannot control tempo or sequence  
`1` - User can control tempo or sequence with difficulty  
`2` - User can control tempo or sequence  

#### Stimulation

`1` - Involves sight, hearing, and touch  
`2` - Involves sight and hearing  
`3` - Involves sight  

#### Technical limitations

`1` - Content requires special software or equipment  
`2` - Content requires modern browser or equipment  
`3` - Content can be opened with minimal technical competency  

#### Standards

`0` - Practically impossible to comply with standards for accessibility  
`1` - Difficult to comply with standards for accessibility  
`2` - Manageable to comply with standards for accessibility  
`3` - Easy to comply with standards for accessibility  

### Development

Necessary time and expertise necessary to produce the content. Both time and technical competency are relative to other content types, not absolute values.

#### Time

`1` - Very little  
`2` - Little  
`3` - Medium  
`4` - Much  
`5` - Very much  

#### Technical competency

`1` - Very low  
`2` - Low  
`3` - Medium  
`4` - High  
`5` - Very high  

### Implementation

How many people are likely necessary to develop the content based on subject-matter experts input, and publish it.

#### Involved

`1` - One  
`2` - Two  
`3` - Three or more  