def sort_by_type(results):
    res = {}
    for item in results:
        res.setdefault(item['type'], []).append(item)
    return res
