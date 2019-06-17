---
layout: page
title: Links
description: 
keywords: 
comments: true
menu: Links
permalink: /links/
---

> God made relatives. Thank God we can choose our friends.

{% for link in site.data.links %}
* [{{ link.name }}]({{ link.url }})
{% endfor %}
